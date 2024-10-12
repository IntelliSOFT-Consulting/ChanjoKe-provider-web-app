import { Typography } from 'antd'
import { Link } from 'react-router-dom'
import { isDiluentOrDropper } from '../../../utils/methods'

const { Text } = Typography

export const getMaximumQuantity = (record, quantity) => {
  const deficit = Number(record.maximum || 0) - Number(quantity)
  return deficit > 0 ? deficit : 0
}

export const getMinimumQuantity = (record, quantity) => {
  const deficit =
    Number(quantity) < Number(record.minimum || 0)
      ? Number(record.minimum) - Number(quantity)
      : 0
  return deficit
}

export const minMaxNotSet = (record) => {
  return record.vaccine && record.minimum === null && record.maximum === null
}

export const ValidationMessage = (record) => {
  if (isDiluentOrDropper(record.vaccine)) return null

  switch (true) {
    case minMaxNotSet(record):
      return (
        <Text style={{ fontSize: '12px' }}>
          Set min and max values for this vaccine{' '}
          <Link
            to="/stock-management/stock-configuration"
            style={{ textDecoration: 'underline' }}
            state={{ isOrder: true }}
          >
            here
          </Link>
        </Text>
      )
    case record.quantity >= record.maximum && record.maximum > 0:
      return 'Ordered amount cannot be greater than maximum stock allowed'
    case record.quantity <= record.minimum && record.minimum > 0:
      return 'Ordered amount cannot be less than minimum stock allowed'
  }
}
