
import { GameEvent } from './types';

export const INITIAL_TOTAL = 200; // 200 x 1000 = 200,000 VND
export const TOTAL_ROUNDS = 5;

export const EVENTS: GameEvent[] = [
  {
    id: 'repair_heavy',
    title: 'Hỏng xe máy nặng',
    description: 'Xe bị hỏng xích và lốp, chi phí sửa chữa khá cao.',
    impact: () => ({ totalImpact: -80 })
  },
  {
    id: 'hospital',
    title: 'Đi khám bệnh',
    description: 'Bạn bị sốt xuất huyết và phải mua thuốc điều trị.',
    impact: () => ({ totalImpact: -60 })
  },
  {
    id: 'charity_big',
    title: 'Ủng hộ bão lụt',
    description: 'Một đợt thiên tai xảy ra, bạn quyết định đóng góp giúp đỡ đồng bào.',
    impact: () => ({ totalImpact: -30 })
  },
  {
    id: 'scam_total',
    title: 'Bị lừa đảo qua mạng',
    description: 'Kẻ xấu giả danh ngân hàng rút sạch hũ Tiết kiệm của bạn!',
    impact: (current) => ({ saving: 0, totalImpact: -current.saving })
  },
  {
    id: 'bonus',
    title: 'Thưởng nóng dự án',
    description: 'Bạn hoàn thành xuất sắc nhiệm vụ và được công ty thưởng thêm.',
    impact: () => ({ totalImpact: 70 })
  },
  {
    id: 'freelance',
    title: 'Làm thêm cuối tuần',
    description: 'Bạn nhận được một công việc thiết kế/dịch thuật ngoài giờ.',
    impact: () => ({ totalImpact: 50 })
  },
  {
    id: 'laptop_broken',
    title: 'Hỏng màn hình Laptop',
    description: 'Sự cố bất ngờ khiến bạn phải thay màn hình mới.',
    impact: () => ({ totalImpact: -120 })
  },
  {
    id: 'fine',
    title: 'Phạt vi phạm giao thông',
    description: 'Bạn đi ngược chiều và bị cảnh sát thổi phạt.',
    impact: () => ({ totalImpact: -40 })
  },
  {
    id: 'wedding',
    title: 'Đi đám cưới bạn thân',
    description: 'Một khoản chi không thể tránh khỏi trong tháng này.',
    impact: () => ({ totalImpact: -50 })
  },
  {
    id: 'lottery_small',
    title: 'Trúng số nhỏ',
    description: 'Tờ vé số may mắn mang lại cho bạn một khoản tiền bất ngờ.',
    impact: () => ({ totalImpact: 100 })
  },
  {
    id: 'party',
    title: 'Tiệc tùng quá đà',
    description: 'Bạn đi ăn mừng với bạn bè và chi tiêu vượt kế hoạch.',
    impact: () => ({ totalImpact: -70 })
  }
];
