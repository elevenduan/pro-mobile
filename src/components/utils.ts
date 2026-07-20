import { SPECIAL_CHARS } from "./constants";

/** 判断值是否为 null 或 undefined。 */
export const isNil = (value: unknown): value is null | undefined => value == null;

/** 判断值是否为原始字符串。 */
export const isString = (value: unknown): value is string => typeof value === "string";

/** 判断字符串、数组、Map、Set 或对象是否为空。 */
export const isEmpty = (value: unknown): boolean => {
  if (isNil(value)) return true;
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/** 判断值是否可转换为有限数值。 */
export const isNumeric = (value: unknown): boolean => {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string" || value.trim() === "") return false;
  return Number.isFinite(Number(value));
};

/** 判断值是否为 URL；默认仅接受 HTTP 和 HTTPS 协议。 */
export const isUrl = (value: unknown, loose = false): boolean => {
  if (!isString(value)) return false;
  try {
    const url = new URL(value);
    return loose || url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/** 判断值是否符合常见的电子邮箱格式。 */
export const isEmail = (value: unknown): boolean => isString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** 判断值是否为不含前导零的 IPv4 地址。 */
export const isIpv4 = (value: unknown): boolean => {
  if (!isString(value)) return false;
  const parts = value.split(".");
  return parts.length === 4 && parts.every((part) => /^(0|[1-9]\d{0,2})$/.test(part) && Number(part) <= 255);
};

/** 判断值是否为由十六进制分组构成的 IPv6 地址，不支持 IPv4 映射格式。 */
export const isIpv6 = (value: unknown): boolean => {
  if (!isString(value)) return false;
  const parts = value.split("::");
  if (parts.length > 2) return false;

  const groups = parts.flatMap((part) => (part === "" ? [] : part.split(":")));
  if (groups.some((group) => !/^[\da-fA-F]{1,4}$/.test(group))) return false;
  return parts.length === 2 ? groups.length < 8 : groups.length === 8;
};

/** 判断值是否为 IPv4 或 IPv6 地址。 */
export const isIp = (value: unknown): boolean => isIpv4(value) || isIpv6(value);

/** 使用 Luhn 算法判断值是否为银行卡号，loose 模式会放宽长度限制。 */
export const isBankNo = (value: unknown, loose = false): boolean => {
  if (!isString(value)) return false;
  const cardNumber = value.replace(/[\s-]/g, "");
  const minLength = loose ? 8 : 9;
  const maxLength = loose ? 30 : 20;
  if (!new RegExp(`^\\d{${minLength},${maxLength}}$`).test(cardNumber)) return false;

  let sum = 0;
  for (let index = cardNumber.length - 1; index >= 0; index -= 1) {
    let digit = Number(cardNumber[index]);
    if ((cardNumber.length - 1 - index) % 2 === 1) digit *= 2;
    sum += digit > 9 ? digit - 9 : digit;
  }
  return sum % 10 === 0;
};

/** 判断值是否为校验码和出生日期均有效的中国大陆居民身份证号码。 */
export const isIdNo = (value: unknown): boolean => {
  if (!isString(value)) return false;
  if (!/^\d{17}[\dXx]$/.test(value)) return false;

  const birthDate = value.slice(6, 14);
  const date = new Date(`${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}T00:00:00`);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(birthDate.slice(0, 4)) ||
    date.getMonth() + 1 !== Number(birthDate.slice(4, 6)) ||
    date.getDate() !== Number(birthDate.slice(6, 8))
  ) {
    return false;
  }

  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = "10X98765432";
  const sum = weights.reduce((total, weight, index) => total + Number(value[index]) * weight, 0);
  return checkCodes[sum % 11] === value[17].toUpperCase();
};

/** 判断值是否为以 13 至 19 开头的 11 位中国大陆手机号码。 */
export const isMobile = (value: unknown): boolean => isString(value) && /^1[3-9]\d{9}$/.test(value);

/** 判断值是否为校验码有效的统一社会信用代码（USCI）。 */
export const isUsci = (value: unknown): boolean => {
  if (!isString(value)) return false;
  const code = value.toUpperCase();
  if (!/^[0-9A-Z]{18}$/.test(code)) return false;

  const characters = "0123456789ABCDEFGHJKLMNPQRTUWXY";
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const sum = weights.reduce((total, weight, index) => total + characters.indexOf(code[index]) * weight, 0);
  return code[17] === characters[(31 - (sum % 31)) % 31];
};

/** 转义将要插入正则字符类的特殊字符。 */
const escape = (value: string): string => value.replace(/[\\\]^\-]/g, "\\$&");

type PasswordOptions = { alpha?: boolean; sensitive?: boolean; number?: boolean; special?: string; min?: number; max?: number };

/** 根据字母、数字和特殊字符规则判断密码是否有效。 */
export const isPassword = (value: unknown, options: PasswordOptions = {}): boolean => {
  if (!isString(value)) return false;

  const { alpha = true, sensitive = false, number = true, special = SPECIAL_CHARS, min = 8, max = 16 } = options;
  const escapeChars = escape(special);
  if (value.length < min || value.length > max) return false;
  if (!new RegExp(`^[A-Za-z\\d${escapeChars}]*$`).test(value)) return false;
  if (alpha !== /[A-Za-z]/.test(value)) return false;
  if (alpha && sensitive && (!/[A-Z]/.test(value) || !/[a-z]/.test(value))) return false;
  if (number !== /\d/.test(value)) return false;
  if (Boolean(special) !== new RegExp(`[${escapeChars}]`).test(value)) return false;

  return true;
};

type Mergeable = Record<PropertyKey, unknown> | unknown[];

/** 判断值是否为可递归合并的普通对象。 */
const isPlainObject = (value: unknown): value is Record<PropertyKey, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/** 深度合并多个对象或数组；数组按下标合并，后续来源会覆盖同名键或同下标的值。 */
export const merge = <T extends Mergeable>(target: T, ...sources: Mergeable[]): T => {
  const mergeValue = (current: unknown, next: unknown): unknown => {
    if (Array.isArray(current) && Array.isArray(next)) {
      const result = [...current];
      next.forEach((value, index) => {
        result[index] = mergeValue(result[index], value);
      });
      return result;
    }

    if (isPlainObject(current) && isPlainObject(next)) {
      const result: Record<PropertyKey, unknown> = { ...current };
      Reflect.ownKeys(next).forEach((key) => {
        result[key] = mergeValue(result[key], next[key]);
      });
      return result;
    }

    if (Array.isArray(next)) return next.map((value) => mergeValue(undefined, value));
    if (isPlainObject(next)) return mergeValue({}, next);
    return next;
  };

  return sources.reduce<T>((result, source) => mergeValue(result, source) as T, mergeValue(undefined, target) as T);
};
