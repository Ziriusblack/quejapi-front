export interface ComplaintSearchRequest {
    searchTerm:String | null;
    status: number | null;
    page: number;
    size: number;
    sortBy: String;
    sortDirection: String;
}
