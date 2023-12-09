import Link from "next/link";
import properties from "../../data/properties";
import Image from "next/image";
import Pagination from "../common/blog/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import officeData from "../../services/office-service";
import currencyFormatter from "currency-formatter"
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from "react-hot-toast";
const Listings = (officeDataDetail) => {
  // İki tarih arasındaki farkı hesaplayan fonksiyon
  // function calculateTimeAgo(date) {
  //   const currentDate = new Date(); // Günümüz tarihi
  //   const postDate = new Date(date); // Verilen tarih
  //   const timeDifference = currentDate - postDate; // İki tarih arasındaki milisaniye farkı

  //   // Milisaniyeyi yıl, ay veya gün cinsinden dönüştürmek için hesaplamalar yapılır
  //   const seconds = Math.floor(timeDifference / 1000);
  //   const minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);
  //   const days = Math.floor(hours / 24);
  //   const months = Math.floor(days / 30);
  //   const years = Math.floor(months / 12);

  //   // Hesaplamalara göre uygun metni döndürün
  //   if (years > 0) {
  //     return `${years} yıl önce`;
  //   } else if (months > 0) {
  //     return `${months} ay önce`;
  //   } else if (days > 0) {
  //     return `${days} gün önce`;
  //   } else if (hours > 0) {
  //     return `${hours} saat önce`;
  //   } else if (minutes > 0) {
  //     return `${minutes} dakika önce`;
  //   } else {
  //     return `${seconds} saniye önce`;
  //   }
  // }
  console.log(officeDataDetail);
  const router = useRouter();
  // const id = router.query.id;
  const [officeAdvert, setOfficeAdvert] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [excludedTimes, setExcludedTimes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [changeDate, setChangeDate] = useState(null);
  const [change, setChange] = useState(null);
  const paginate = 4;
  const dateList = async (id) => {
    await officeData.officeAdvertResponse(id).then((data) => {
      console.log(data);
      setAppointmentList(data?.data);
      // toast.success("Randevu tarihi başarıyla alındı."); 
    }).catch((error) => {
      console.log(error);
      toast.error("Bir Sorun Oluştu.");
    })
  }

  useEffect(() => {
    if (officeDataDetail?.officeDataDetail) {
      dateList(officeDataDetail?.officeDataDetail?.userId)
    }
  }, [officeDataDetail?.officeDataDetail, change]);



  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
      const newDate = new Date(date.getTime() + 3 * 60 * 60 * 1000)
      setChangeDate(newDate);
    }
  };

  const handleAppointment = async () => {
    if (changeDate) {
      const obj = {
        doctorId: officeDataDetail?.officeDataDetail?.userId,
        dateTime: changeDate
      };
      await officeData
        .appointmentOffice(obj)
        .then((data) => {
          if (data?.succeded === true) {
            toast.success(data?.message);
            setChange(data?.data?.dateTime);
             router.push("/randevu");
          } else {
            toast.error(data?.message);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Randevu tarihi alınamadı.");
        });
    } else {
      toast.error("Randevu tarihi seçilmedi.");
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        containerClassName=""
        containerStyle={{
          opacity: "100%",
        }}
        toastOptions={{
          // Define default options
          className: "",
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            opacity: "100%",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
            style: {
              opacity: "100%",
            },
          },
          error: {
            duration: 3000,
            style: {
              opacity: "100%!important",
            },
          },
        }}
      />

      <div className="row">
        <div className="col-lg-12 mt20">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={10}
            dateFormat="dd/MM/yyyy HH:mm" // Tarih ve saat formatı
            timeFormat="HH:mm" // Sadece saat formatı
            minDate={new Date()} // Geçmiş tarihlerin seçilmesini engeller
            minTime={new Date(0, 0, 0, 9, 0)} // 09:00
            maxTime={new Date(0, 0, 0, 18, 0)} // 18:00
            placeholderText="Tarih ve saat seçin"
            filterDate={date => date.getDay() !== 6 && date.getDay() !== 0}
            excludeTimes={(selectedDate && appointmentList
              .filter(date => {
                const appointmentDate = new Date(date);
                return (
                  appointmentDate.getDate() === selectedDate?.getDate() &&
                  appointmentDate.getMonth() === selectedDate?.getMonth() &&
                  appointmentDate.getFullYear() === selectedDate?.getFullYear()
                );
              })
              .map(date => {
                const appointmentDate = new Date(date);
                return new Date(0, 0, 0, appointmentDate.getHours(), appointmentDate.getMinutes());
              })
            ) || []}
            filterTime={(time, selectedDate) => {
              if (!selectedDate) {
                return true; // Eğer bir tarih seçilmediyse, tüm saatleri göster
              }

              const selectedDay = selectedDate?.getDate();
              const selectedMonth = selectedDate?.getMonth();
              const selectedYear = selectedDate?.getFullYear();
              const isSameDay = appointmentList.some(date => {
                const appointmentDate = new Date(date);
                return (
                  appointmentDate.getDate() === selectedDay &&
                  appointmentDate.getMonth() === selectedMonth &&
                  appointmentDate.getFullYear() === selectedYear
                );
              });

              if (isSameDay) {
                return (
                  time.getHours() >= 9 &&
                  time.getHours() < 18 &&
                  appointmentList.every(date => {
                    const appointmentDate = new Date(date);
                    return (
                      appointmentDate.getDate() !== selectedDay ||
                      appointmentDate.getMonth() !== selectedMonth ||
                      appointmentDate.getFullYear() !== selectedYear ||
                      appointmentDate.getHours() !== time.getHours() ||
                      appointmentDate.getMinutes() !== time.getMinutes()
                    );
                  })
                );
                // Seçilen tarihe ait saatleri hariç tut, sadece 9-18 saatleri arasındaki saatleri göster
              }
              return true; // Diğer durumlar için saatleri göster
            }}
          />
        </div>

        <p className="text-center">  </p>
        <p className="text-left">  <button className="btn btn-primary mt-3" onClick={handleAppointment}>
          Randevu Al
        </button>  </p>
      </div>

    </>
  );
};

export default Listings;
