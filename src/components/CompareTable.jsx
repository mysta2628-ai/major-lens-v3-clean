export default function CompareTable({ majors }) {
  return (
    <div className="mt-10 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-sm text-[#7a867c]">
            <th className="px-4 py-2">Criteria</th>
            {majors.map((major) => (
              <th key={major.key} className="px-4 py-2">{major.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["learningStyle", "careers", "fit"].map((criterion) => (
            <tr key={criterion} className="rounded-[20px] bg-white">
              <td className="rounded-l-[18px] border border-r-0 border-[#e6e9e2] px-4 py-4 font-medium capitalize text-[#21352d]">
                {criterion}
              </td>
              {majors.map((major, i) => (
                <td key={major.key + criterion} className={`border border-[#e6e9e2] px-4 py-4 text-[#5f6d62] ${i === majors.length - 1 ? "rounded-r-[18px]" : "border-l-0"}`}>
                  {Array.isArray(major[criterion]) ? major[criterion].join(", ") : major[criterion]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
