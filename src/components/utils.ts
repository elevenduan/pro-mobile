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

/** 判断值是否为 6 位数字短信验证码。 */
export const isSms = (value: unknown): boolean => isString(value) && /^\d{6}$/.test(value);

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

const isUnsafeMergeKey = (key: PropertyKey): boolean => key === "__proto__" || key === "constructor" || key === "prototype";

/** 判断值是否为可递归合并的普通对象。 */
const isPlainObject = (value: unknown): value is Record<PropertyKey, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/** 深度合并多个对象或数组；数组按下标合并，undefined 来源会被忽略。 */
export const merge = <T extends Mergeable>(target: T, ...sources: (Mergeable | undefined)[]): T => {
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
        if (isUnsafeMergeKey(key)) return;
        result[key] = mergeValue(result[key], next[key]);
      });
      return result;
    }

    if (Array.isArray(next)) return next.map((value) => mergeValue(undefined, value));
    if (isPlainObject(next)) return mergeValue({}, next);
    return next;
  };

  return sources.reduce<T>((result, source) => (source === undefined ? result : (mergeValue(result, source) as T)), mergeValue(undefined, target) as T);
};

/** 按指定方向将值的字符串表示分组。 */
export const separator = (value: unknown, sign = " ", length = 4, reverse = false): string => {
  const len = Number.isInteger(length) && length > 0 ? length : 4;
  const reg = reverse ? `(\\S{1,${len}})(?=(\\S{${len}})+(?:$))` : `(\\S{${len}})(?=\\S)`;
  return String(value).replace(new RegExp(reg, "g"), (_, group: string) => group + sign);
};

/** 使用千分位逗号格式化数值，可选显示货币符号和固定小数位数。 */
export const thousand = (value: unknown, currency = "", fixed?: number): string => {
  if (!isNumeric(value)) return "";
  const digits = typeof fixed === "number" && Number.isInteger(fixed) && fixed >= 0 ? fixed : undefined;
  const options = digits === undefined ? {} : { minimumFractionDigits: digits, maximumFractionDigits: digits };
  const formatter = new Intl.NumberFormat("en-US", options);
  const formatted = formatter.format(Math.abs(Number(value)));
  return `${Number(value) < 0 ? "-" : ""}${currency}${formatted}`;
};

type Decimal = { negative: boolean; digits: string; scale: number };

const parseDecimal = (value: unknown): Decimal | null => {
  if (typeof value !== "number" && !isString(value)) return null;
  if (typeof value === "number" && !Number.isFinite(value)) return null;

  const match = String(value)
    .trim()
    .match(/^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/);
  if (!match || (!match[2] && !match[3])) return null;

  const exponent = Number(match[4] ?? 0);
  if (!Number.isSafeInteger(exponent)) return null;
  const digits = `${match[2]}${match[3] ?? ""}`.replace(/^0+/, "") || "0";
  return { negative: match[1] === "-", digits, scale: (match[3]?.length ?? 0) - exponent };
};

/** 将十进制值缩放为指定小数位的整数，并按远离零方向四舍五入。 */
const toScaledInteger = (value: unknown, scale: number): bigint | null => {
  const decimal = parseDecimal(value);
  if (!decimal) return null;

  const shift = scale - decimal.scale;
  let result: bigint;
  if (shift >= 0) {
    result = BigInt(decimal.digits) * 10n ** BigInt(shift);
  } else {
    const divisor = 10n ** BigInt(-shift);
    const amount = BigInt(decimal.digits);
    result = amount / divisor;
    if ((amount % divisor) * 2n >= divisor) result += 1n;
  }
  return decimal.negative && result !== 0n ? -result : result;
};

/** 按指定倍率缩放十进制值；未指定小数位数时保留原始精度。 */
export const decimal = (value: unknown, scale = 0, fixed?: number): string => {
  const source = parseDecimal(value);
  if (!source || !Number.isSafeInteger(scale) || (fixed !== undefined && (!Number.isSafeInteger(fixed) || fixed < 0))) return "";

  const digits = fixed ?? Math.max(source.scale - scale, 0);
  const targetScale = scale + digits;
  if (!Number.isSafeInteger(digits) || !Number.isSafeInteger(targetScale)) return "";

  const amount = toScaledInteger(value, targetScale);
  if (amount === null) return "";
  const negative = amount < 0n;
  const integer = (negative ? -amount : amount).toString();
  if (digits === 0) return `${negative ? "-" : ""}${integer}`;

  const padded = integer.padStart(digits + 1, "0");
  return `${negative ? "-" : ""}${padded.slice(0, -digits)}.${padded.slice(-digits)}`;
};

/** 将字符串区间内的字符替换为指定符号。 */
export const asterisk = (value: unknown, start = 0, end?: number, sign = "*"): string => {
  if (!isString(value)) return "";
  const slice = value.slice(start, end);
  const prefix = value.slice(0, start);
  return value.replace(prefix + slice, prefix + slice.replace(/./g, sign));
};

type FormValue = string | number | boolean | bigint | null | undefined | object;

const serializeFormValue = (value: FormValue): string | undefined => {
  if (isNil(value)) return undefined;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

/** 模拟表单提交 */
export function openWithForm(url: string, data: Record<string, FormValue> = {}, method: "POST" | "GET" = "POST") {
  const form = document.createElement("form");
  form.style.display = "none";
  form.action = url;
  form.method = method;

  Object.keys(data).forEach((key) => {
    const value = serializeFormValue(data[key]);
    if (value === undefined) return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/** 优化空值显示。 */
export function display(value: unknown, unit?: string, empty: string = "-"): string {
  if (isEmpty(value)) return empty;
  return `${String(value)}${unit ?? ""}`;
}

/** 下载文件。 */
export function downloadFile(url: string, name: string) {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
