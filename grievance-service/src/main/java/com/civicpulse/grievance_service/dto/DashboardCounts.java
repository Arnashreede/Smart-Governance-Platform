package com.civicpulse.grievance_service.dto;

public class DashboardCounts {

    private long totalGrievances;
    private long pending;
    private long inProgress;
    private long resolved;
    private long closed;
private long escalated;
    public DashboardCounts() {
    }

    public DashboardCounts(
    long totalGrievances,
    long pending,
    long inProgress,
    long resolved,
    long closed,
    long escalated) {

    this.totalGrievances = totalGrievances;
    this.pending = pending;
    this.inProgress = inProgress;
    this.resolved = resolved;
    this.closed = closed;
    this.escalated = escalated;
}

    public long getTotalGrievances() {
        return totalGrievances;
    }

    public void setTotalGrievances(long totalGrievances) {
        this.totalGrievances = totalGrievances;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public void setResolved(long resolved) {
        this.resolved = resolved;
    }

    public long getClosed() {
        return closed;
    }

    public void setClosed(long closed) {
        this.closed = closed;
    }
    public long getEscalated() {
    return escalated;
}

public void setEscalated(long escalated) {
    this.escalated = escalated;
}
}