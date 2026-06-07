import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import { getDeviceList } from '@/services/device'
import type { Device, DeviceStatus } from '@/types/device'
import { USE_MOCK } from '@/utils/constant'

import './index.scss'

type DeviceFilter = 'all' | DeviceStatus

const FILTER_OPTIONS: Array<{ key: DeviceFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'normal', label: '正常' },
  { key: 'repairing', label: '报修中' }
]

const BINDABLE_DEVICE_CANDIDATES: Device[] = [
  {
    id: 101,
    name: '全自动三坐标测量仪',
    icon: '🔬',
    status: 'normal',
    statusText: '正常',
    code: 'WH00000002',
    model: 'CMM-8106',
    productionDate: '2024年3月15日',
    warrantyEndDate: '2027年3月15日',
    warrantyStatus: 'active',
    warrantyText: '在保中'
  },
  {
    id: 102,
    name: '高精度检测设备',
    icon: '🔬',
    status: 'normal',
    statusText: '正常',
    code: 'WH00000003',
    model: 'HD-2000',
    productionDate: '2022年10月20日',
    warrantyEndDate: '2025年10月20日',
    warrantyStatus: 'expired',
    warrantyText: '已过期'
  }
]

const STATUS_COLOR_MAP: Record<DeviceStatus, string> = {
  normal: '#28a86b',
  repairing: '#ff934d'
}

export default function DevicePage() {
  const [activeFilter, setActiveFilter] = useState<DeviceFilter>('all')
  const [deviceList, setDeviceList] = useState<Device[]>([])
  const [bindCandidates, setBindCandidates] = useState<Device[]>(BINDABLE_DEVICE_CANDIDATES)

  useEffect(() => {
    getDeviceList().then(setDeviceList).catch(() => {
      Taro.showToast({ title: '设备列表加载失败', icon: 'none' })
    })
  }, [])

  const filteredDeviceList = activeFilter === 'all'
    ? deviceList
    : deviceList.filter((item) => item.status === activeFilter)

  const getWarrantyClassName = (status: Device['warrantyStatus']) =>
    status === 'active' ? 'device-card__warranty-tag--active' : 'device-card__warranty-tag--expired'

  const bindDevice = (device: Device, sourceText: '扫码' | '手动') => {
    setDeviceList((prev) => [device, ...prev])
    setBindCandidates((prev) => prev.filter((item) => item.id !== device.id))
    Taro.showToast({
      title: `${sourceText}绑定成功`,
      icon: 'success'
    })
  }

  const handleFilterChange = () => {
    Taro.showActionSheet({
      itemList: FILTER_OPTIONS.map((item) => item.label),
      success: ({ tapIndex }) => {
        const selectedOption = FILTER_OPTIONS[tapIndex]
        if (!selectedOption) return
        setActiveFilter(selectedOption.key)
      }
    })
  }

  const handleManualAdd = () => {
    if (!bindCandidates.length) {
      Taro.showToast({ title: '暂无可添加设备', icon: 'none' })
      return
    }

    Taro.showActionSheet({
      itemList: bindCandidates.map((item) => item.name),
      success: ({ tapIndex }) => {
        const selectedDevice = bindCandidates[tapIndex]
        if (!selectedDevice) return
        bindDevice(selectedDevice, '手动')
      }
    })
  }

  const handleScanBind = async () => {
    if (!bindCandidates.length) {
      Taro.showToast({ title: '暂无可绑定设备', icon: 'none' })
      return
    }

    if (USE_MOCK) {
      bindDevice(bindCandidates[0], '扫码')
      return
    }

    try {
      await Taro.scanCode({ scanType: ['qrCode'] })
      bindDevice(bindCandidates[0], '扫码')
    } catch {
      // User canceled scan.
    }
  }

  const handleRepair = (device: Device) => {
    if (device.status !== 'normal') {
      Taro.showToast({ title: '该设备正在报修中', icon: 'none' })
      return
    }

    Taro.setStorageSync(STORAGE_KEYS.REPAIR_SELECTED_DEVICE_ID, device.id)
    Taro.switchTab({ url: '/pages/repair/index' })
  }

  return (
    <View className='device-page'>
      <View className='device-page__toolbar'>
        <View className='device-page__filter-trigger' onClick={handleFilterChange}>
          <Text className='device-page__filter-text'>
            {FILTER_OPTIONS.find((item) => item.key === activeFilter)?.label ?? '全部'}
          </Text>
          <Text className='device-page__filter-arrow'>⌄</Text>
        </View>

        <View className='device-page__manual-entry' onClick={handleManualAdd}>
          <Text className='device-page__manual-entry-text'>手动添加</Text>
        </View>
      </View>

      <View className='device-page__content'>
        <View className='device-page__scan-card' onClick={handleScanBind}>
          <View className='device-page__scan-icon'>
            <View className='device-page__scan-icon-cell' />
            <View className='device-page__scan-icon-cell' />
            <View className='device-page__scan-icon-cell' />
            <View className='device-page__scan-icon-cell' />
          </View>
          <Text className='device-page__scan-title'>扫码绑定设备</Text>
          <Text className='device-page__scan-desc'>扫描设备机身二维码自动识别设备</Text>
        </View>

        <View className='device-page__list'>
          {filteredDeviceList.map((device) => {
            const canRepair = device.status === 'normal'
            const statusColor = STATUS_COLOR_MAP[device.status]

            return (
              <View key={device.id} className='device-card'>
                <View className='device-card__header'>
                  <View className='device-card__media'>
                    <View className='device-card__icon-wrap'>
                      <Text className='device-card__icon'>{device.icon}</Text>
                    </View>

                    <View className='device-card__summary'>
                      <Text className='device-card__name'>{device.name}</Text>
                      <Text className='device-card__code'>设备编号：{device.code}</Text>
                    </View>
                  </View>

                  <View className='device-card__status' style={{ color: statusColor }}>
                    <Text className='device-card__status-dot'>●</Text>
                    <Text className='device-card__status-text'>{device.statusText}</Text>
                  </View>
                </View>

                <View className='device-card__detail-list'>
                  <View className='device-card__detail-row'>
                    <Text className='device-card__detail-label'>设备型号：</Text>
                    <Text className='device-card__detail-value'>{device.model}</Text>
                  </View>
                  <View className='device-card__detail-row'>
                    <Text className='device-card__detail-label'>出厂日期：</Text>
                    <Text className='device-card__detail-value'>{device.productionDate}</Text>
                  </View>
                  <View className='device-card__detail-row'>
                    <Text className='device-card__detail-label'>质保截止日期：</Text>
                    <Text className='device-card__detail-value'>{device.warrantyEndDate}</Text>
                  </View>
                </View>

                <View className='device-card__footer'>
                  <View className={`device-card__warranty-tag ${getWarrantyClassName(device.warrantyStatus)}`}>
                    {device.warrantyText}
                  </View>

                  <View
                    className={`device-card__action ${canRepair ? '' : 'is-disabled'}`}
                    onClick={() => handleRepair(device)}
                  >
                    <Text className='device-card__action-text'>立即报修</Text>
                    <Text className='device-card__action-arrow'>→</Text>
                  </View>
                </View>
              </View>
            )
          })}

          {!filteredDeviceList.length && (
            <View className='device-page__empty'>
              <Text className='device-page__empty-text'>当前筛选条件下暂无设备</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
