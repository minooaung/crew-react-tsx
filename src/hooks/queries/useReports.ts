import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { AxiosResponse } from "axios";

type OutputFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';
type ReportType = 'users' | 'organisations';

interface ReportMetadata {
  mimeType: string;
  fileExtension: string;
}

interface GenerateReportParams {
  reportType: ReportType;
  outputFormat: OutputFormat;
}

// Define type for report response data based on format
type ReportResponseData = string | Blob | Record<string, unknown>;

// Helper function to get MIME type and file extension
const getReportMetadata = (outputFormat: OutputFormat): ReportMetadata => {
  const mimeTypes: Record<OutputFormat, string> = {
    pdf: "application/pdf",
    excel: "application/vnd.ms-excel",
    csv: "text/csv",
    json: "application/json",
    html: "text/html",
  };

  const fileExtensions: Record<OutputFormat, string> = {
    pdf: "pdf",
    excel: "xls",
    csv: "csv",
    json: "json",
    html: "html",
  };

  return {
    mimeType: mimeTypes[outputFormat],
    fileExtension: fileExtensions[outputFormat],
  };
};

// Helper function to handle report response
const handleReportResponse = (
  response: AxiosResponse<ReportResponseData>,
  reportType: ReportType,
  outputFormat: OutputFormat
): string | null => {
  if (outputFormat === "html") {
    return response.data as string;
  }

  // For all file downloads (PDF, Excel, CSV, JSON)
  const { mimeType, fileExtension } = getReportMetadata(outputFormat);
  
  let blob: Blob;
  if (outputFormat === "json") {
    const jsonStr = JSON.stringify(response.data as Record<string, unknown>, null, 2);
    blob = new Blob([jsonStr], { type: mimeType });
  } else if (response.data instanceof Blob) {
    blob = response.data;
  } else {
    blob = new Blob([response.data as string], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${reportType}-report.${fileExtension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return null; // No data to return for file downloads
};

export const useGenerateReport = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({ reportType, outputFormat }: GenerateReportParams) => {
      const isHtml = outputFormat === "html";
      const isJson = outputFormat === "json";

      const response = await axios.post<ReportResponseData>(
        "/reports/generate",
        {
          reportType,
          outputFormat,
        },
        {
          responseType: isHtml ? "text" : isJson ? "json" : "blob",
        }
      );

      return handleReportResponse(response, reportType, outputFormat);
    },
  });
};

// Optional: Add more report-related hooks here if needed
// For example, hooks for saving report preferences, fetching available report types, etc. 