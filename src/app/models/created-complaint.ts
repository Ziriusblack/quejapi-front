export interface CreatedComplaint {
    id: number | string;
    reference: String;
    subject: String;  
    description: String;        
    predictedPriority?: string;    
    priorityConfidence?: number;   
}