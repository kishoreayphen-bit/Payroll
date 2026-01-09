-- Add leave type tracking to attendance table
ALTER TABLE attendance ADD COLUMN leave_type_id BIGINT;
ALTER TABLE attendance ADD COLUMN leave_request_id BIGINT;

-- Add foreign key constraints
ALTER TABLE attendance ADD CONSTRAINT fk_attendance_leave_type 
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id);

ALTER TABLE attendance ADD CONSTRAINT fk_attendance_leave_request 
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id);

-- Add index for better query performance
CREATE INDEX idx_attendance_leave_type ON attendance(leave_type_id);
CREATE INDEX idx_attendance_leave_request ON attendance(leave_request_id);
