import React, { useContext } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate } from "react-router-dom";

function CompanyDashboard() {
  const { company, companyLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await companyLogout();
    navigate("/company/login");
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={`http://localhost:5000/${company.companyIcon}`} 
              alt="logo" 
              className="w-16 h-16 rounded-full border-2 border-white object-cover"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
              <p className="text-indigo-100">{company.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="p-6">
          {!company.isVerified ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-bold">
                    Your account is not verified.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-green-700 font-bold">
                  Your account is verified!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="text-lg font-semibold">{company.phone}</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-lg font-semibold">{company.address}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">Company Images</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {company.companyImages && company.companyImages.map((img, index) => (
                    <img 
                      key={index} 
                      src={`http://localhost:5000/${img}`} 
                      alt={`Company ${index}`} 
                      className="w-48 h-32 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">Legal Documents</h3>
                <a 
                  href={`http://localhost:5000/${company.legalDocument}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Legal Document
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
