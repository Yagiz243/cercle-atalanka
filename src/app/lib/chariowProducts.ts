export const chariowProductIds: Record<string, string> = {
  '9f22a3a6-2bcf-46e3-b934-88f6404f8a11': '',
  'd6cc96ab-c861-4467-ac95-5e247d9f7bd3': '',
  '40d1a930-7bf4-4b0f-9581-d3a0f5d31d9e': '',
  'f38f78fd-5246-4d77-9940-355d709d77a1': '',
  '7d84ce5d-a765-4517-a847-f3c6d2f679ea': '',
  'ab5f3a43-a609-4a8b-8d15-3d1b177dfedb': '',
  '8ca0a485-31cb-4f64-b613-3df2fd44ca65': '',
  '5a9155cd-f5aa-4960-a87b-0a074a4f8ea0': '',
  'd89cff8f-59bc-4255-bf10-90f2f40f6388': '',
  'b50a2af5-815f-4124-a379-4e86c3b6b65d': '',
  'd22ad37b-8f98-45b9-9ab2-29d3a6c3370a': '',
  '62eca44f-f661-443a-8d5a-a5834972e3d8': '',
};

export function getChariowProductId(itemId: string) {
  return chariowProductIds[itemId] || '';
}