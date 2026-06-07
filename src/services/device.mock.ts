import type { Device } from '@/types/device'

const mockDevices: Device[] = [
  {
    id: 1,
    name: 'VMS系列手动影像测量仪',
    icon: '🔬',
    status: 'normal',
    statusText: '正常',
    code: 'WH00000001',
    model: 'VMS-3020',
    productionDate: '2025年6月30日',
    warrantyEndDate: '2028年6月30日',
    warrantyStatus: 'active',
    warrantyText: '在保中'
  },
  {
    id: 2,
    name: 'VTM系列影像工具测量显微镜',
    icon: '🔬',
    status: 'repairing',
    statusText: '报修中',
    code: 'WH00000001',
    model: 'VMS-3020',
    productionDate: '2023年6月30日',
    warrantyEndDate: '2025年6月30日',
    warrantyStatus: 'expired',
    warrantyText: '已过期'
  }
]

export function mockGetDeviceList(): Promise<Device[]> {
  console.info('[DeviceServiceMock] Returning mock device list.')
  return Promise.resolve(mockDevices)
}
