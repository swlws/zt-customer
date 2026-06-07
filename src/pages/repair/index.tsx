import { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

interface Device {
  id: number;
  name: string;
  code: string;
  model: string;
  productionDate: string;
  warrantyEndDate: string;
}

interface FaultType {
  id: number;
  label: string;
}

interface Ticket {
  id: number;
  number: string;
  status: 'repairing' | 'in_progress' | 'completed';
  statusText: string;
  deviceName: string;
  deviceCode: string;
  deviceModel: string;
  repairTime: string;
  faultType: string;
  description: string;
  canEvaluate: boolean;
}

const faultTypes: FaultType[] = [
  { id: 1, label: '视觉昏暗、亮度不足' },
  { id: 2, label: '重影、像散、色彩畸变' },
  { id: 3, label: '调焦故障' },
  { id: 4, label: '载物台故障' },
  { id: 5, label: '灯光闪烁忽明忽暗' },
  { id: 6, label: '其他' },
]

const devices: Device[] = [
  {
    id: 1,
    name: 'VMS系列手动影像测量仪',
    code: 'WH00000001',
    model: 'VMS-3020',
    productionDate: '2025年6月30日',
    warrantyEndDate: '2028年6月30日',
  },
  {
    id: 2,
    name: '全自动三坐标测量仪',
    code: 'WH00000002',
    model: 'CMM-8106',
    productionDate: '2024年3月15日',
    warrantyEndDate: '2027年3月15日',
  },
]

const tickets: Ticket[] = [
  {
    id: 1,
    number: 'NO000001',
    status: 'repairing',
    statusText: '报修中',
    deviceName: 'VMS系列手动影像测量仪',
    deviceCode: 'WH00000001',
    deviceModel: 'VMS-3020',
    repairTime: '2026-06-07 10:30',
    faultType: '调焦故障',
    description: '设备调焦困难，无法清晰对焦，尝试多次调整无效',
    canEvaluate: false,
  },
  {
    id: 2,
    number: 'NO000002',
    status: 'in_progress',
    statusText: '维修中',
    deviceName: '全自动三坐标测量仪',
    deviceCode: 'WH00000002',
    deviceModel: 'CMM-8106',
    repairTime: '2026-06-05 14:20',
    faultType: '灯光闪烁忽明忽暗',
    description: '设备灯光不稳定，使用过程中频繁闪烁',
    canEvaluate: false,
  },
  {
    id: 3,
    number: 'NO000003',
    status: 'completed',
    statusText: '已完成',
    deviceName: 'VMS系列手动影像测量仪',
    deviceCode: 'WH00000001',
    deviceModel: 'VMS-3020',
    repairTime: '2026-06-01 09:00',
    faultType: '其他',
    description: '设备出现异常噪音，需要检修',
    canEvaluate: true,
  },
]

export default function RepairPage() {
  const [activeTab, setActiveTab] = useState<string>('form')

  const [formData, setFormData] = useState({
    deviceId: null as number | null,
    repairPerson: '',
    phone: '',
    expectTime: '',
    address: '',
    selectedFaultTypes: [] as number[],
    description: '',
    images: [] as string[],
  })

  const selectedDevice = formData.deviceId
    ? (devices.find((d) => d.id === formData.deviceId) ?? null)
    : null

  const handleSelectDevice = () => {
    Taro.showActionSheet({
      itemList: devices.map((d) => d.name),
      success: (res) => {
        setFormData({
          ...formData,
          deviceId: devices[res.tapIndex].id,
        })
      },
    })
  }

  const toggleFaultType = (id: number) => {
    const currentIds = formData.selectedFaultTypes
    const newIds = currentIds.includes(id)
      ? currentIds.filter((i) => i !== id)
      : [...currentIds, id]
    setFormData({ ...formData, selectedFaultTypes: newIds })
  }

  const handleSubmit = () => {
    Taro.showToast({
      title: '提交成功',
      icon: 'success',
    })
  }

  const goToDetail = (ticketId: number) => {
    Taro.navigateTo({
      url: '/pages/ticket-detail/index?id=' + ticketId,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'repairing':
        return '#fa8c16'
      case 'in_progress':
        return '#1677ff'
      case 'completed':
        return '#52c41a'
      default:
        return '#999'
    }
  }

  return (
    <View className='repair-page'>
      <View className='repair-page__tabs'>
        <View
          className={`repair-page__tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          <Text className='repair-page__tab-text'>在线报修</Text>
        </View>
        <View
          className={`repair-page__tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          <Text className='repair-page__tab-text'>报修记录</Text>
        </View>
      </View>

      {activeTab === 'form' && (
        <View className='repair-page__content'>
          <View className='form-section'>
            <View className='form-section__title'>设备信息</View>

            <View
              className='form-item form-item--row'
              onClick={handleSelectDevice}
            >
              <View className='form-item__label'>
                <Text className='required'>*</Text>
                <Text>设备名称</Text>
              </View>
              <View className='form-item__control'>
                <View className='form-item__value'>
                  <Text className={selectedDevice ? '' : 'placeholder'}>
                    {selectedDevice ? selectedDevice.name : '请选择设备...'}
                  </Text>
                  <Text className='arrow'>▼</Text>
                </View>
              </View>
            </View>

            {selectedDevice && (
              <View className='device-info'>
                <View className='device-info__item'>
                  <Text className='label'>设备编号：</Text>
                  <Text className='value'>{selectedDevice.code}</Text>
                </View>
                <View className='device-info__item'>
                  <Text className='label'>设备型号：</Text>
                  <Text className='value'>{selectedDevice.model}</Text>
                </View>
                <View className='device-info__item'>
                  <Text className='label'>出厂日期：</Text>
                  <Text className='value'>{selectedDevice.productionDate}</Text>
                </View>
                <View className='device-info__item'>
                  <Text className='label'>质保截止日期：</Text>
                  <Text className='value'>
                    {selectedDevice.warrantyEndDate}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className='form-section'>
            <View className='form-section__title'>报修信息</View>

            <View className='form-item form-item--row'>
              <View className='form-item__label'>
                <Text className='required'>*</Text>
                <Text>报修人</Text>
              </View>
              <View className='form-item__control'>
                <Input
                  className='form-item__input'
                  placeholder='请输入...'
                  value={formData.repairPerson}
                  onInput={(e) =>
                    setFormData({ ...formData, repairPerson: e.detail.value })
                  }
                />
              </View>
            </View>

            <View className='form-item form-item--row'>
              <View className='form-item__label'>
                <Text className='required'>*</Text>
                <Text>联系电话</Text>
              </View>
              <View className='form-item__control'>
                <Input
                  className='form-item__input'
                  type='number'
                  placeholder='请输入...'
                  value={formData.phone}
                  onInput={(e) =>
                    setFormData({ ...formData, phone: e.detail.value })
                  }
                />
              </View>
            </View>

            <View className='form-item form-item--row'>
              <View className='form-item__label'>
                <Text className='required'>*</Text>
                <Text>期望维修时间</Text>
              </View>
              <View className='form-item__control'>
                <View className='form-item__value'>
                  <Text className={formData.expectTime ? '' : 'placeholder'}>
                    {formData.expectTime || '请选择...'}
                  </Text>
                  <Text className='arrow'>📅</Text>
                </View>
              </View>
            </View>

            <View className='form-item form-item--col'>
              <View className='form-item__label'>
                <Text className='required'>*</Text>
                <Text>地址</Text>
              </View>
              <Textarea
                className='form-item__textarea'
                placeholder='请输入报修具体地址...'
                value={formData.address}
                onInput={(e) =>
                  setFormData({ ...formData, address: e.detail.value })
                }
              />
            </View>
          </View>

          <View className='form-section'>
            <View className='form-section__title'>故障类型</View>
            <View className='fault-types'>
              {faultTypes.map((type) => (
                <View
                  key={type.id}
                  className={`fault-type-tag ${formData.selectedFaultTypes.includes(type.id) ? 'active' : ''}`}
                  onClick={() => toggleFaultType(type.id)}
                >
                  {type.label}
                </View>
              ))}
            </View>
          </View>

          <View className='form-section'>
            <View className='form-section__title'>故障描述</View>
            <View className='form-item form-item--col'>
              <Textarea
                className='form-item__textarea'
                placeholder='请详细描述设备故障情况...'
                value={formData.description}
                onInput={(e) =>
                  setFormData({ ...formData, description: e.detail.value })
                }
              />
            </View>

            <View className='upload-header'>
              <Text className='upload-title'>上传图片/视频</Text>
              <Text className='upload-tip'>最多可上传6张图片或视频；</Text>
            </View>
            <View className='upload-grid'>
              {formData.images.map((_, index) => (
                <View key={index} className='upload-item'>
                  <View
                    className='upload-item__image'
                    style={{ background: '#f0f0f0' }}
                  />
                  <View className='upload-item__delete'>✕</View>
                </View>
              ))}
              {formData.images.length < 6 && (
                <View className='upload-item upload-item__add'>
                  <Text className='upload-icon'>📷</Text>
                </View>
              )}
            </View>
          </View>

          <View className='submit-section'>
            <View className='submit-btn' onClick={handleSubmit}>
              <Text>确认提交</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'records' && (
        <View className='repair-page__content'>
          <View className='ticket-list'>
            {tickets.map((ticket) => (
              <View key={ticket.id} className='ticket-card'>
                <View className='ticket-card__header'>
                  <Text className='ticket-card__number'>
                    报修单编号：{ticket.number}
                  </Text>
                  <View
                    className='ticket-card__status'
                    style={{
                      backgroundColor: getStatusColor(ticket.status) + '20',
                      color: getStatusColor(ticket.status),
                    }}
                  >
                    <Text className='ticket-card__status-text'>
                      ● {ticket.statusText}
                    </Text>
                  </View>
                </View>

                <View className='ticket-card__info'>
                  <View className='ticket-card__info-item'>
                    <Text className='label'>设备名称：</Text>
                    <Text className='value ellipsis'>{ticket.deviceName}</Text>
                  </View>
                  <View className='ticket-card__info-item'>
                    <Text className='label'>报修时间：</Text>
                    <Text className='value'>{ticket.repairTime}</Text>
                  </View>
                  <View className='ticket-card__info-item'>
                    <Text className='label'>故障类型：</Text>
                    <Text className='value'>{ticket.faultType}</Text>
                  </View>
                </View>

                <View className='ticket-card__footer'>
                  {ticket.canEvaluate && (
                    <View className='ticket-card__btn secondary'>
                      <Text>写评价</Text>
                    </View>
                  )}
                  <View
                    className='ticket-card__btn'
                    onClick={() => goToDetail(ticket.id)}
                  >
                    <Text>查看</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}
