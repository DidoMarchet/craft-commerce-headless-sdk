import { Client } from './client';

export interface pdfDownloadData {
  number?: string;
  option?: string;
  pdfHandle?: string;
}

/**
 * Cart-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for cart-related actions.
 */
export const downloads = (craftClient: Client) => {
  const pdf = async (pdfDownloadData: pdfDownloadData): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/downloads/pdf',
      pdfDownloadData
    );
  };

  return {
    pdf,
  };
};
