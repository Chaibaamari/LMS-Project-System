import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
    rows?: number
    columns?: number
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array(columns)
                            .fill(0)
                            .map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-7 w-24" />
                                </TableHead>
                            ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array(rows)
                        .fill(0)
                        .map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array(columns)
                                    .fill(0)
                                    .map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton className="h-5 w-full" />
                                        </TableCell>
                                    ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

