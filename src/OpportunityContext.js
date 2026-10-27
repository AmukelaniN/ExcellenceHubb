import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "./api";

const OpportunityContext = createContext(null);

function opportunityPayload(details) {
  return {
    type: details.type,
    title: details.title,
    organisation: details.organisation,
    location: details.location,
    deadline: details.deadline,
    officialUrl: details.officialUrl,
    whoCanApply: details.whoCanApply,
    detail: details.detail,
  };
}

function savedWorkspaceRole() {
  try {
    return JSON.parse(sessionStorage.getItem("excellencehub-api-session") || "null")?.role || "";
  } catch {
    return "";
  }
}

export function OpportunityProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshOpportunities = useCallback(async (role = savedWorkspaceRole(), whoCanApply = "") => {
    if (!role) {
      setOpportunities([]);
      setError("");
      setIsLoading(false);
      return [];
    }

    const endpoint = role === "administrator"
      ? "/api/opportunities/manage"
      : role === "employer"
        ? "/api/opportunities/mine"
        : `/api/opportunities${whoCanApply ? `?whoCanApply=${encodeURIComponent(whoCanApply)}` : ""}`;

    setIsLoading(true);
    setError("");
    try {
      const items = await apiRequest(endpoint);
      setOpportunities(items);
      return items;
    } catch (requestError) {
      setError(requestError.message || "Could not load opportunities.");
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOpportunities().catch(() => {});
  }, [refreshOpportunities]);

  const submitOpportunity = async (details) => {
    const created = await apiRequest("/api/opportunities", {
      method: "POST",
      body: opportunityPayload(details),
    });
    setOpportunities((current) => [created, ...current]);
    return created;
  };

  const updateOpportunity = async (id, details) => {
    const updated = await apiRequest(`/api/opportunities/${id}`, {
      method: "PUT",
      body: opportunityPayload(details),
    });
    setOpportunities((current) => current.map((item) => item.id === id ? updated : item));
    return updated;
  };
  const updateOpportunityStatus = async (id, status) => {
    const updated = await apiRequest(`/api/opportunities/${id}/status`, {
      method: "PUT",
      body: { status },
    });
    setOpportunities((current) => current.map((item) => item.id === id ? updated : item));
    return updated;
  };
  const deleteOpportunity = async (id) => {
    await apiRequest(`/api/opportunities/${id}`, { method: "DELETE" });
    setOpportunities((current) => current.filter((item) => item.id !== id));
  };

  return <OpportunityContext.Provider value={{ opportunities, isLoading, error, refreshOpportunities, submitOpportunity, updateOpportunity, updateOpportunityStatus, deleteOpportunity }}>{children}</OpportunityContext.Provider>;
}

export function useOpportunities() {
  const context = useContext(OpportunityContext);
  if (!context) throw new Error("useOpportunities must be used within an OpportunityProvider");
  return context;
}

