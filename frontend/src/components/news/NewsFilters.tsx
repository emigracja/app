import { ReactElement, useEffect, useState } from "react";

interface Props {
  onSubmit: (searchParams: { [key: string]: string }) => void;
}

const NewsFilters = ({ onSubmit }: Props): ReactElement => {
  const [nameQuery, setNameQuery] = useState("");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: nameQuery,
      from: fromQuery,
      to: toQuery,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 w-full text-white">
      <label className="p-2">Search by title</label>
      <input
        className="p-2 mb-2 w-full text-white border-white border-1 rounded-xl outline-none"
        type="text"
        placeholder="title..."
        onChange={(e) => setNameQuery(e.target.value)}
      />
      <div className="w-full flex gap-2 mb-2">
        <div className="w-[50%]">
          <label className="p-2">From</label>
          <input
            className="p-2 w-full text-white border-white border-1 rounded-xl outline-none"
            type="date"
            onChange={(e) => setFromQuery(e.target.value)}
          />
        </div>
        <div className="w-[50%]">
          <label className="p-2">To</label>
          <input
            className="p-2 w-full border-white border-1 rounded-xl outline-none"
            type="date"
            onChange={(e) => setToQuery(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className={`
                my-2 p-2 w-full rounded-xl font-semibold transition duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                focus:ring-offset-gray-800/70 bg-blue-600 hover:bg-blue-700`}
      >
        Search
      </button>
    </form>
  );
};

export default NewsFilters;
