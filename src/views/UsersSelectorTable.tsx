import { useState, useEffect, MouseEvent, useCallback } from "react";
import { useUsers, useSelectedUsers } from "../hooks/queries/useUsers";
import { User, PaginationLink } from "../types";

interface UsersSelectorTableProps {
  selectedUserIds: number[];
  setSelectedUserIds: React.Dispatch<React.SetStateAction<number[]>>;
}

interface ValidationErrors {
  [key: string]: string[];
}

export default function UsersSelectorTable({
  selectedUserIds,
  setSelectedUserIds,
}: UsersSelectorTableProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<Map<number, User>>(new Map());

  // Fetch paginated users for the table
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError
  } = useUsers(currentPage, "");

  // Fetch all selected users' data
  const {
    data: selectedUsersData,
    isLoading: isLoadingSelected
  } = useSelectedUsers(selectedUserIds);

  // Memoized function to update allUsers Map
  const updateUsersMap = useCallback((users: User[], prevUsers: Map<number, User>) => {
    const newUsers = new Map(prevUsers);
    users.forEach(user => {
      newUsers.set(user.id, user);
    });
    return newUsers;
  }, []);

  // Update allUsers Map with paginated users
  useEffect(() => {
    if (usersData?.data) {
      setAllUsers(prevUsers => updateUsersMap(usersData.data, prevUsers));
    }
  }, [usersData, updateUsersMap]);

  // Update allUsers Map with selected users and validate selections
  useEffect(() => {
    if (selectedUsersData?.data) {
      setAllUsers(prevUsers => updateUsersMap(selectedUsersData.data, prevUsers));
    }
  }, [selectedUsersData, updateUsersMap]);

  // Validate selected users when data changes
  useEffect(() => {
    if (!isLoadingUsers && !isLoadingSelected && selectedUsersData?.data) {
      const validUserIds = new Set(selectedUsersData.data.map(user => user.id));
      
      setSelectedUserIds(prev => {
        const validSelection = prev.filter(id => validUserIds.has(id));
        return validSelection.length === prev.length ? prev : validSelection;
      });
    }
  }, [isLoadingUsers, isLoadingSelected, selectedUsersData, setSelectedUserIds]);

  const handlePageChange = useCallback((ev: MouseEvent<HTMLButtonElement>, url: string | null) => {
    ev.preventDefault();
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  }, []);

  const toggleUserSelection = useCallback((id: number) => {
    setSelectedUserIds(prevIds => 
      prevIds.includes(id)
        ? prevIds.filter(uid => uid !== id)
        : [...prevIds, id]
    );
  }, [setSelectedUserIds]);

  // Get user data by ID from allUsers Map
  const getUserById = useCallback((id: number): User | undefined => 
    allUsers.get(id)
  , [allUsers]);

  // Show loading state if either users or selected users are loading
  if (isLoadingUsers || isLoadingSelected) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const validationErrors = usersError as ValidationErrors | null;

  return (
    <div className="space-y-4">
      {validationErrors && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              {Object.keys(validationErrors).map((key) => (
                <p key={key} className="text-sm font-medium text-red-800">{validationErrors[key][0]}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Show selected users summary */}
      {selectedUserIds.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Users ({selectedUserIds.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedUserIds.map(id => {
              const user = getUserById(id);
              if (!user) return null;
              return (
                <div 
                  key={id} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {user.name}
                  <button 
                    onClick={() => toggleUserSelection(id)}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                    title="Remove user"
                  >
                    <span className="sr-only">Remove {user.name}</span>
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {usersData && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    <span className="sr-only">Select</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {usersData.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="w-12 whitespace-nowrap py-3 pl-4 pr-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-2 flex items-center justify-between sm:px-6">

            {/* Mobile pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              {usersData.meta.links.map((link: PaginationLink, index: number) => {

                // Rendering the Previous button
                if (link.label === "&laquo; Previous") {
                  return (
                    <button
                      key={index}
                      onClick={(ev) => handlePageChange(ev, link.url)}
                      disabled={!link.url}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                  );
                }

                // Rendering the Next button
                if (link.label === "Next &raquo;") {
                  return (
                    <button
                      key={index}
                      onClick={(ev) => handlePageChange(ev, link.url)}
                      disabled={!link.url}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  );
                }
                return null;
              })}
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{usersData.meta.from}</span> to{" "}
                  <span className="font-medium">{usersData.meta.to}</span> of{" "}
                  <span className="font-medium">{usersData.meta.total}</span> users
                  {selectedUserIds.length > 0 && (
                    <span className="ml-1">
                      (<span className="font-medium">{selectedUserIds.length}</span> selected)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {usersData.meta.links.map((link: PaginationLink, index: number) => {

                    // Rendering the Previous button
                    if (link.label === "&laquo; Previous") {
                      return (
                        <button
                          key={index}
                          onClick={(ev) => handlePageChange(ev, link.url)}
                          disabled={!link.url}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      );
                    }

                    // Rendering the Next button
                    if (link.label === "Next &raquo;") {
                      return (
                        <button
                          key={index}
                          onClick={(ev) => handlePageChange(ev, link.url)}
                          disabled={!link.url}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      );
                    }

                    // Rendering the numbered pagination buttons
                    return (
                      <button
                        key={index}
                        onClick={(ev) => handlePageChange(ev, link.url)}
                        disabled={!link.url}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          link.active
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' // Style for Active page
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' // Style for Inactive page
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span dangerouslySetInnerHTML={{__html: link.label}}></span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 