
// Get inventory usage history for a ground
export const getInventoryUsageHistory = async (groundId: string): Promise<any[]> => {
  // In a real app, this would fetch from a database table like inventory_usage
  // For now, we'll return mock data
  return [
    {
      id: `usage-${Date.now()}-1`,
      groundId,
      itemId: '',
      itemName: 'Football',
      quantity: 2,
      timestamp: new Date().toISOString(),
      userName: 'John Doe'
    },
    {
      id: `usage-${Date.now()}-2`,
      groundId,
      itemId: '',
      itemName: 'Water Bottles',
      quantity: 1,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userName: 'Jane Smith'
    }
  ];
};
