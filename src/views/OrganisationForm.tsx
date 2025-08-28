import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersSelectorTable from "./UsersSelectorTable";
import {
  useOrganisation,
  useCreateOrganisation,
  useUpdateOrganisation,
} from "../hooks/queries/useOrganisations";
import { User, OrganisationData, UpdateOrganisationData } from "../types";
import ErrorAlert from "../utils/ErrorAlert";

interface OrganisationFormData {
  id: number | null;
  name: string;
  users?: User[];
}

interface ValidationErrors {
  [key: string]: string | string[];
}

export default function OrganisationForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [organisation, setOrganisation] = useState<OrganisationFormData>({
    id: null,
    name: "",
  });

  // Fetch organization data if editing
  const {
    data: orgData,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useOrganisation(id ? parseInt(id) : undefined);

  // Create and update mutations
  const createOrganisationMutation = useCreateOrganisation();
  const updateOrganisationMutation = useUpdateOrganisation();

  // Update state when organization data changes
  useEffect(() => {
    if (orgData) {
      setOrganisation(orgData);
      // Set selected user IDs from the organization data
      const userIds = orgData.users?.map((user) => user.id) || [];
      setSelectedUserIds(userIds);
    }
  }, [orgData]);

  const onSubmit = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      try {
        if (organisation.id) {
          const updateData: UpdateOrganisationData = {
            id: organisation.id,
            name: organisation.name,
            user_ids: selectedUserIds,
          };
          await updateOrganisationMutation.mutateAsync(updateData);
        } else {
          const createData: OrganisationData = {
            name: organisation.name,
            user_ids: selectedUserIds,
          };
          await createOrganisationMutation.mutateAsync(createData);
        }

        navigate("/organisations");
      } catch (err) {
        console.error("Failed to save organisation:", err);
      }
    },
    [
      organisation,
      selectedUserIds,
      createOrganisationMutation,
      updateOrganisationMutation,
      navigate,
    ]
  );

  const onCancel = useCallback(() => navigate("/organisations"), [navigate]);

  const validationErrors = (orgError ||
    createOrganisationMutation.error ||
    updateOrganisationMutation.error) as ValidationErrors | null;

  if (isLoadingOrg) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {organisation.id ? "Edit Organisation" : "New Organisation"}
        </h1>
      </div>

      {validationErrors && <ErrorAlert error={validationErrors} />}

      {/* {validationErrors && (
        <div className="rounded-md bg-red-100 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              {Object.entries(validationErrors).map(([key, value]) => (
                <p key={key} className="text-sm font-medium text-red-800">
                  {Array.isArray(value) ? value[0] : value}
                </p>
              ))}
            </div>
          </div>
        </div>
      )} */}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Organisation Name
            </label>
            <input
              id="name"
              value={organisation.name}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                setOrganisation({ ...organisation, name: ev.target.value })
              }
              placeholder="Enter organisation name"
              required={!organisation.id}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="mt-1">
              <UsersSelectorTable
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={
                createOrganisationMutation.isPending ||
                updateOrganisationMutation.isPending
              }
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createOrganisationMutation.isPending ||
                updateOrganisationMutation.isPending
              }
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {createOrganisationMutation.isPending ||
              updateOrganisationMutation.isPending
                ? "Saving..."
                : organisation.id
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
