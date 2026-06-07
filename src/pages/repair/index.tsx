import { useEffect, useState } from 'react'
import { Image, Input, Picker, Text, Textarea, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import { getFaultTypes, getRepairDevices, getTicketList, submitRepair } from '@/services/repair'
import type { FaultType, RepairDevice, Ticket } from '@/types/repair'
import type { UserInfo } from '@/types/user'

import './index.scss'

const INITIAL_FORM_DATA = {
  deviceId: null as number | null,
  repairPerson: '',
  phone: '',
  expectTime: '',
  address: '',
  selectedFaultTypes: [] as number[],
  description: '',
  images: [] as string[]
}

const STATUS_COLOR_MAP: Record<Ticket['status'], string> = {
  repairing: '#ff934d',
  in_progress: '#e9534d',
  completed: '#2b6cff'
}

function formatNow() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
}

export default function RepairPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'records'>('form')
  const [faultTypes, setFaultTypes] = useState<FaultType[]>([])
  const [devices, setDevices] = useState<RepairDevice[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [hasLoadedTickets, setHasLoadedTickets] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const hydrateUserDefaults = () => {
    const userInfo = Taro.getStorageSync<UserInfo>(STORAGE_KEYS.USER_INFO)
    if (!userInfo) return

    setFormData((prev) => ({
      ...prev,
      repairPerson: prev.repairPerson || userInfo.nickName || '',
      phone: prev.phone || userInfo.phone || ''
    }))
  }

  const loadFormData = async (preferredDeviceId?: number) => {
    try {
      const [faultTypeList, deviceList] = await Promise.all([
        getFaultTypes(),
        getRepairDevices()
      ])
      setFaultTypes(faultTypeList)
      setDevices(deviceList)

      if (preferredDeviceId) {
        const matchedDevice = deviceList.find((item) => item.id === preferredDeviceId)
        if (matchedDevice) {
          setFormData((prev) => ({ ...prev, deviceId: matchedDevice.id }))
        }
        Taro.removeStorageSync(STORAGE_KEYS.REPAIR_SELECTED_DEVICE_ID)
      }
    } catch {
      Taro.showToast({ title: '表单数据加载失败', icon: 'none' })
    }
  }

  const loadTickets = async () => {
    try {
      const ticketList = await getTicketList()
      setTickets(ticketList)
      setHasLoadedTickets(true)
    } catch {
      Taro.showToast({ title: '报修记录加载失败', icon: 'none' })
    }
  }

  useDidShow(() => {
    const preferredDeviceId = Taro.getStorageSync<number>(STORAGE_KEYS.REPAIR_SELECTED_DEVICE_ID)
    if (preferredDeviceId) {
      setActiveTab('form')
    }

    hydrateUserDefaults()
    loadFormData(preferredDeviceId)

    if (activeTab === 'records' && !preferredDeviceId) {
      loadTickets()
    }
  })

  useEffect(() => {
    if (activeTab === 'records' && !hasLoadedTickets) {
      loadTickets()
    }
  }, [activeTab, hasLoadedTickets])

  const selectedDevice = devices.find((item) => item.id === formData.deviceId) ?? null
  const selectedFaultTypeLabels = faultTypes
    .filter((item) => formData.selectedFaultTypes.includes(item.id))
    .map((item) => item.label)

  const updateFormField = <K extends keyof typeof INITIAL_FORM_DATA>(
    key: K,
    value: (typeof INITIAL_FORM_DATA)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleTabChange = (tab: 'form' | 'records') => {
    if (tab === activeTab) return
    setActiveTab(tab)
  }

  const handleSelectDevice = () => {
    if (!devices.length) {
      Taro.showToast({ title: '暂无可选设备', icon: 'none' })
      return
    }

    Taro.showActionSheet({
      itemList: devices.map((item) => item.name),
      success: ({ tapIndex }) => {
        const device = devices[tapIndex]
        if (!device) return
        updateFormField('deviceId', device.id)
      }
    })
  }

  const handleChooseImage = async () => {
    const remainCount = 6 - formData.images.length
    if (remainCount <= 0) {
      Taro.showToast({ title: '最多上传6张', icon: 'none' })
      return
    }

    try {
      const res = await Taro.chooseImage({
        count: remainCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      updateFormField('images', [...formData.images, ...res.tempFilePaths])
    } catch {
      // User canceled image selection.
    }
  }

  const handleDeleteImage = (index: number) => {
    updateFormField(
      'images',
      formData.images.filter((_, currentIndex) => currentIndex !== index)
    )
  }

  const handlePreviewImage = (current: string) => {
    Taro.previewImage({
      current,
      urls: formData.images
    })
  }

  const toggleFaultType = (id: number) => {
    const nextIds = formData.selectedFaultTypes.includes(id)
      ? formData.selectedFaultTypes.filter((item) => item !== id)
      : [...formData.selectedFaultTypes, id]

    updateFormField('selectedFaultTypes', nextIds)
  }

  const validateForm = () => {
    if (!formData.deviceId) return '请选择设备'
    if (!formData.repairPerson.trim()) return '请输入报修人'
    if (!formData.phone.trim()) return '请输入联系电话'
    if (!/^1\d{10}$/.test(formData.phone.trim())) return '请输入正确的手机号'
    if (!formData.expectTime) return '请选择期望维修时间'
    if (!formData.address.trim()) return '请输入报修地址'
    if (!formData.selectedFaultTypes.length) return '请选择故障类型'
    if (!formData.description.trim()) return '请输入故障描述'
    return ''
  }

  const resetForm = () => {
    const userInfo = Taro.getStorageSync<UserInfo>(STORAGE_KEYS.USER_INFO)

    setFormData({
      ...INITIAL_FORM_DATA,
      repairPerson: userInfo?.nickName || '',
      phone: userInfo?.phone || ''
    })
  }

  const handleSubmit = async () => {
    const errorMessage = validateForm()
    if (errorMessage) {
      Taro.showToast({ title: errorMessage, icon: 'none' })
      return
    }

    if (!selectedDevice) {
      Taro.showToast({ title: '设备信息异常，请重新选择', icon: 'none' })
      return
    }

    setSubmitting(true)

    try {
      const result = await submitRepair({
        deviceId: formData.deviceId as number,
        repairPerson: formData.repairPerson.trim(),
        phone: formData.phone.trim(),
        expectTime: formData.expectTime,
        address: formData.address.trim(),
        faultTypeIds: formData.selectedFaultTypes,
        description: formData.description.trim(),
        images: formData.images
      })

      const nextTicket: Ticket = {
        id: result.ticketId,
        number: `NO${String(result.ticketId).slice(-6).padStart(6, '0')}`,
        status: 'repairing',
        statusText: '报修中',
        deviceName: selectedDevice.name,
        deviceCode: selectedDevice.code,
        deviceModel: selectedDevice.model,
        repairTime: formatNow(),
        faultType: selectedFaultTypeLabels.join('、'),
        description: formData.description.trim(),
        canEvaluate: false
      }

      setTickets((prev) => [nextTicket, ...prev])
      setHasLoadedTickets(true)
      resetForm()
      setActiveTab('records')

      Taro.showToast({
        title: '提交成功',
        icon: 'success'
      })
    } catch {
      Taro.showToast({
        title: '提交失败',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const goToDetail = (ticketId: number, mode: 'view' | 'evaluate' = 'view') => {
    Taro.navigateTo({
      url: `/pages/ticket-detail/index?id=${ticketId}&mode=${mode}`
    })
  }

  const renderInfoRow = (label: string, value?: string, placeholder = '--') => (
    <View className='repair-page__info-row'>
      <Text className='repair-page__info-label'>{label}</Text>
      <Text className={`repair-page__info-value ${value ? '' : 'is-placeholder'}`}>
        {value || placeholder}
      </Text>
    </View>
  )

  return (
    <View className='repair-page'>
      <View className='repair-page__tabs'>
        <View
          className={`repair-page__tab ${activeTab === 'form' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('form')}
        >
          <Text className='repair-page__tab-text'>在线报修</Text>
        </View>
        <View className='repair-page__tab-divider' />
        <View
          className={`repair-page__tab ${activeTab === 'records' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('records')}
        >
          <Text className='repair-page__tab-text'>报修记录</Text>
        </View>
      </View>

      {activeTab === 'form' && (
        <View className='repair-page__content repair-page__content--form'>
          <View className='repair-page__card'>
            <View className='repair-page__section-title'>设备信息</View>

            <View className='repair-page__field repair-page__field--picker' onClick={handleSelectDevice}>
              <View className='repair-page__field-label'>
                <Text className='repair-page__required'>*</Text>
                <Text>设备名称：</Text>
              </View>
              <View className='repair-page__field-value'>
                <Text className={selectedDevice ? '' : 'is-placeholder'}>
                  {selectedDevice?.name || '请选择设备...'}
                </Text>
                <Text className='repair-page__field-arrow'>⌄</Text>
              </View>
            </View>

            {renderInfoRow('设备编号：', selectedDevice?.code)}
            {renderInfoRow('设备型号：', selectedDevice?.model)}
            {renderInfoRow('出厂日期：', selectedDevice?.productionDate)}
            {renderInfoRow('质保截止日期：', selectedDevice?.warrantyEndDate)}
          </View>

          <View className='repair-page__card'>
            <View className='repair-page__section-title'>报修信息</View>

            <View className='repair-page__field'>
              <View className='repair-page__field-label'>
                <Text className='repair-page__required'>*</Text>
                <Text>报修人：</Text>
              </View>
              <Input
                className='repair-page__field-input'
                placeholder='请输入...'
                placeholderClass='repair-page__placeholder'
                value={formData.repairPerson}
                onInput={(e) => updateFormField('repairPerson', e.detail.value)}
              />
            </View>

            <View className='repair-page__field'>
              <View className='repair-page__field-label'>
                <Text className='repair-page__required'>*</Text>
                <Text>联系电话：</Text>
              </View>
              <Input
                className='repair-page__field-input'
                type='number'
                placeholder='请输入...'
                placeholderClass='repair-page__placeholder'
                value={formData.phone}
                maxlength={11}
                onInput={(e) => updateFormField('phone', e.detail.value)}
              />
            </View>

            <Picker
              mode='date'
              value={formData.expectTime}
              onChange={(e) => updateFormField('expectTime', e.detail.value)}
            >
              <View className='repair-page__field repair-page__field--picker'>
                <View className='repair-page__field-label'>
                  <Text className='repair-page__required'>*</Text>
                  <Text>期望维修时间：</Text>
                </View>
                <View className='repair-page__field-value'>
                  <Text className={formData.expectTime ? '' : 'is-placeholder'}>
                    {formData.expectTime || '请选择...'}
                  </Text>
                  <Text className='repair-page__field-arrow'>⌄</Text>
                </View>
              </View>
            </Picker>

            <View className='repair-page__field repair-page__field--textarea'>
              <View className='repair-page__field-label'>
                <Text className='repair-page__required'>*</Text>
                <Text>地址：</Text>
              </View>
              <Textarea
                className='repair-page__textarea'
                maxlength={120}
                autoHeight
                placeholder='请输入报修具体地址，地址超长换行展示...'
                placeholderClass='repair-page__placeholder'
                value={formData.address}
                onInput={(e) => updateFormField('address', e.detail.value)}
              />
            </View>
          </View>

          <View className='repair-page__card'>
            <View className='repair-page__section-title'>故障类型</View>
            <View className='repair-page__fault-list'>
              {faultTypes.map((item) => (
                <View
                  key={item.id}
                  className={`repair-page__fault-tag ${formData.selectedFaultTypes.includes(item.id) ? 'is-active' : ''}`}
                  onClick={() => toggleFaultType(item.id)}
                >
                  {item.label}
                </View>
              ))}
            </View>
          </View>

          <View className='repair-page__card'>
            <View className='repair-page__section-title'>故障描述</View>
            <Textarea
              className='repair-page__description'
              maxlength={300}
              autoHeight
              placeholder='请详细描述设备故障情况...'
              placeholderClass='repair-page__placeholder'
              value={formData.description}
              onInput={(e) => updateFormField('description', e.detail.value)}
            />
          </View>

          <View className='repair-page__card'>
            <View className='repair-page__section-title'>上传图片/视频</View>
            <Text className='repair-page__upload-tip'>最多可上传6张图片或视频；</Text>

            <View className='repair-page__upload-grid'>
              {formData.images.map((image, index) => (
                <View key={image + index} className='repair-page__upload-item'>
                  <Image
                    className='repair-page__upload-image'
                    src={image}
                    mode='aspectFill'
                    onClick={() => handlePreviewImage(image)}
                  />
                  <View
                    className='repair-page__upload-delete'
                    onClick={() => handleDeleteImage(index)}
                  >
                    ×
                  </View>
                </View>
              ))}

              {formData.images.length < 6 && (
                <View className='repair-page__upload-item repair-page__upload-item--add' onClick={handleChooseImage}>
                  <Text className='repair-page__upload-add-icon'>📷</Text>
                </View>
              )}
            </View>
          </View>

          <View className='repair-page__submit-wrap'>
            <View
              className={`repair-page__submit-btn ${submitting ? 'is-disabled' : ''}`}
              onClick={handleSubmit}
            >
              <Text>{submitting ? '提交中...' : '确认提交'}</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'records' && (
        <View className='repair-page__content'>
          <View className='repair-page__record-list'>
            {tickets.map((ticket) => (
              <View key={ticket.id} className='repair-page__record-card'>
                <View className='repair-page__record-header'>
                  <Text className='repair-page__record-number'>报修单编号：{ticket.number}</Text>
                  <View
                    className='repair-page__record-status'
                    style={{ color: STATUS_COLOR_MAP[ticket.status] }}
                  >
                    <Text className='repair-page__record-dot'>●</Text>
                    <Text>{ticket.statusText}</Text>
                  </View>
                </View>

                <View className='repair-page__record-body'>
                  {renderInfoRow('设备编号：', ticket.deviceCode)}
                  {renderInfoRow('设备名称：', ticket.deviceName)}
                  {renderInfoRow('设备型号：', ticket.deviceModel)}
                  {renderInfoRow('报修时间：', ticket.repairTime)}
                  {renderInfoRow('故障类型：', ticket.faultType)}
                  <View className='repair-page__info-row repair-page__info-row--multiline'>
                    <Text className='repair-page__info-label'>故障描述：</Text>
                    <Text className='repair-page__info-value repair-page__info-value--multiline'>
                      {ticket.description}
                    </Text>
                  </View>
                </View>

                <View className='repair-page__record-actions'>
                  {ticket.canEvaluate && (
                    <View
                      className='repair-page__action-btn repair-page__action-btn--secondary'
                      onClick={() => goToDetail(ticket.id, 'evaluate')}
                    >
                      <Text>写评价</Text>
                    </View>
                  )}
                  <View className='repair-page__action-btn' onClick={() => goToDetail(ticket.id)}>
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
