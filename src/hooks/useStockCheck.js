import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useInventory from './useInventory';
import { useVaccineLevels } from './useVaccineLevels';

export const useStockCheck = () => {
  const { getAggregateInventoryItems, inventoryItems } = useInventory();
  const { fetchVaccineLevels } = useVaccineLevels();
  const { vaccineLevels } = useSelector((state) => state.vaccineSchedules);
  const { user } = useSelector((state) => state.userInfo);

  useEffect(() => {
    const interval = setInterval(fetchVaccineLevels, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.orgUnit?.code && vaccineLevels?.id) {
      getAggregateInventoryItems();
    }
  }, [user?.orgUnit?.code, vaccineLevels]);

  const stockCheck = useMemo(() => {
    return vaccineLevels?.parameter?.map(({ name, min, max }) => {
      const stock = inventoryItems?.find((item) => item.vaccine === name)?.quantity || 0;
      return {
        vaccine: name,
        minimum: min,
        maximum: max,
        stock,
      };
    }) || [];
  }, [vaccineLevels, inventoryItems]);

  const belowMinimumStock = useMemo(() => 
    stockCheck.filter(({ stock, minimum }) => stock && minimum && stock < minimum).map(({ vaccine }) => vaccine).join(', '), 
    [stockCheck]
  );

  const aboveMaximumStock = useMemo(() => 
    stockCheck.filter(({ stock, maximum }) => stock && maximum && stock > maximum).map(({ vaccine }) => vaccine).join(', '), 
    [stockCheck]
  );

  return {
    belowMinimumStock,
    aboveMaximumStock,
  };
};
