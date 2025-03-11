import slugify from 'slugify';
import pinyin from 'pinyin';
import crypto from 'crypto';

export const slugifyUtil = (text: string): string => {
  // 将中文转换为拼音数组
  const pinyinArray = pinyin(text, { style: pinyin.STYLE_NORMAL });
  // 将拼音数组展平并以空字符串连接
  const pinyinText = pinyinArray.flat().join('');
  // 利用 slugify 得到基础 slug（纯英文、小写）
  const baseSlug = slugify(pinyinText, { lower: false, strict: true }).toUpperCase();

  // 获取当前时间戳
  const timestamp = new Date().getTime();
  // 拼接原始字符串，包含 baseSlug、articleId 和 timestamp
  const raw = `${baseSlug}${timestamp}`;

  // 使用 SHA256 生成哈希，并截取前10位作为加密效果
  const hash = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 10);

  // 返回最终 slug，例如：baseSlug-hash
  return `${baseSlug}-${hash}`;
};
