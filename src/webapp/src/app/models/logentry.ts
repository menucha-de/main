/**
 * Log Entry structure
 */
export interface LogEntry {
    /**
     * Log Entry ID
     */
    id?: string;
    /**
     * Timestamp of the log entry
     */
    time?: string;
    /**
     * Name of the log target
     */
    targetName?: string;
    /**
     * Source method
     */
    sourceMethod?: string;
    /**
     * Log level
     */
    level?: string;
    /**
     * Log message
     */
    message?: string;
    /**
     * Thrown
     */
    thrown?: string;
}