import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";


interface DynamiquePaginationProps { 
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
}

export function Pagination({
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage
}: DynamiquePaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page number buttons */}
                <div className="flex items-center">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum: number
                        if (totalPages <= 5) {
                            // If 5 or fewer pages, show all
                            pageNum = i + 1
                        } else if (currentPage <= 3) {
                            // If near start, show first 5 pages
                            pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                            // If near end, show last 5 pages
                            pageNum = totalPages - 4 + i
                        } else {
                            // Otherwise show 2 before and 2 after current page
                            pageNum = currentPage - 2 + i
                        }

                        return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => goToPage(pageNum)}
                                aria-label={`Page ${pageNum}`}
                                aria-current={currentPage === pageNum ? "page" : undefined}
                            >
                                {pageNum}
                            </Button>
                        )
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}