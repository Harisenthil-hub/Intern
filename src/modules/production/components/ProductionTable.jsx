import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductionTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg text-slate-500 bg-white">
        No production data
      </div>
    );
  }

  const getGasStyle = (type) => {
    switch (type) {
      case "Oxygen":
        return "bg-blue-100 text-blue-700";
      case "Nitrogen":
        return "bg-purple-100 text-purple-700";
      case "LPG":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100">
            <TableHead>Date</TableHead>
            <TableHead>Plant</TableHead>
            <TableHead>Gas Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Tank</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i} className="hover:bg-slate-50">
              <TableCell className="font-medium">{item.date || "—"}</TableCell>

              <TableCell>{item.plant || "—"}</TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getGasStyle(
                    item.gasType
                  )}`}
                >
                  {item.gasType || "—"}
                </span>
              </TableCell>

              <TableCell>
                {item.quantity ? `${item.quantity} L` : "—"}
              </TableCell>

              <TableCell>{item.batch || "—"}</TableCell>

              <TableCell>{item.tank || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
