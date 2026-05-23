// Formatting utilities

export const formatters = {
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  percentage: (value: number, decimals = 0): string => {
    return `${value.toFixed(decimals)}%`;
  },

  number: (value: number): string => {
    return new Intl.NumberFormat().format(value);
  },

  currency: (value: number, currency = "INR"): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(value);
  },

  fileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  timeAgo: (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? "s" : ""} ago`;
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? "s" : ""} ago`;
    }

    interval = seconds / 86400;
    if (interval > 1) {
      return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? "s" : ""} ago`;
    }

    interval = seconds / 3600;
    if (interval > 1) {
      return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? "s" : ""} ago`;
    }

    interval = seconds / 60;
    if (interval > 1) {
      return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  },

  truncate: (text: string, length: number): string => {
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  titleCase: (text: string): string => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
};
