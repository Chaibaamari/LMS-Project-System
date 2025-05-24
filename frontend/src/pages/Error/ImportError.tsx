
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/indexD";

export default function ImportErrors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { importErrors, importErrorCount, importErrorMessage } = useSelector((state: RootState) => state.PlanPrevision);

    const handleGoBack = () => {
        dispatch(PrevisionActions.ClearImportErrors());
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Erreurs d'importation</h1>
                <Button onClick={handleGoBack}>Retour</Button>
            </div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">{importErrorCount} erreurs trouvées!</strong>
                <span className="block sm:inline"> {importErrorMessage}</span>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ligne</TableHead>
                            <TableHead>Message d'erreur</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {importErrors?.map((error, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{error.row}</TableCell>
                                <TableCell>{error.existence}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleGoBack}>Retour</Button>
            </div>
        </div>
    );
}