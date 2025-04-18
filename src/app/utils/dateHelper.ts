export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Menampilkan nama hari
    year: "numeric", // Menampilkan tahun (e.g., 2025)
    month: "long", // Menampilkan nama bulan (e.g., April)
    day: "numeric", // Menampilkan tanggal (e.g., 18)
    hour: "2-digit", // Menampilkan jam dalam format 2 digit (e.g., 02)
    minute: "2-digit", // Menampilkan menit dalam format 2 digit (e.g., 05)
    second: "2-digit", // Menampilkan detik dalam format 2 digit (e.g., 45)
    hour12: true, // Menggunakan format 12 jam (AM/PM)
  };

  return date.toLocaleDateString("en-US", options);
};
