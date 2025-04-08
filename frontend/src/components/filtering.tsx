import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  type Props = {
    value: string;
    onChange: (value: string) => void;
  };
  
  export function SelectDemo({ value, onChange }: Props) {
    const currentYear = new Date().getFullYear();
    const months = [
      { label: "January", value: `${currentYear}-01` },
      { label: "February", value: `${currentYear}-02` },
      { label: "March", value: `${currentYear}-03` },
      { label: "April", value: `${currentYear}-04` },
      { label: "May", value: `${currentYear}-05` },
      { label: "June", value: `${currentYear}-06` },
      { label: "July", value: `${currentYear}-07` },
      { label: "August", value: `${currentYear}-08` },
      { label: "September", value: `${currentYear}-09` },
      { label: "October", value: `${currentYear}-10` },
      { label: "November", value: `${currentYear}-11` },
      { label: "December", value: `${currentYear}-12` },
    ];
  
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }