import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchHeader = ({ onSearch }: { onSearch: (text: string) => void }) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onSearch(val);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search"
        className="pl-10 pr-4 py-6 bg-zinc-900 text-white rounded-full border border-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchHeader;
