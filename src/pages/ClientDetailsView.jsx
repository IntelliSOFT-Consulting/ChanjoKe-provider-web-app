import SelectDialog from "../common/dialog/SelectDialog";
import BaseTabs from "../common/tabs/BaseTabs";
import { useState } from "react";

export default function ClientDetailsView() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
  };

  return (
    <>

    <SelectDialog
      open={isDialogOpen}
      onClose={handleDialogClose} />
    
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Client Details

        <button
          className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
          View Client Details
        </button>
        <button
          onClick={() => setDialogOpen(true)}
          className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
          Update personal details
        </button>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="container grid grid-cols-2 gap-10">
          <div>
            <p>JOHN DOE - 20 YRS</p>

            <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
              <thead className="divide-y divide-x divide-gray-200">
                <th className="py-3">DOB:</th>
                <th className="py-3">Gender:</th>
              </thead>
              <tbody className="divide-y divide-x divide-gray-200">
                  <tr className="text-center">
                    <td className="whitespace-nowrap py-3 text-sm text-gray-500">JAN 1 2002</td>
                    <td className="whitespace-nowrap py-3 text-sm text-gray-500">Male</td>
                  </tr>
              </tbody>
            </table>
          </div>
          <div>

            <h4>Missed Vaccinations</h4>

            <h6 className="text-red-300">OPV-I</h6>
          </div>
        </div>
      </div>

    </div>

    <div className="mt-10">
      <BaseTabs />
    </div>

    </>
  );
}