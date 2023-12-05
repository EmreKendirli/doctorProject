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
import { toast } from "react-toastify";
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
  const id = router.query.id;
  const [officeAdvert, setOfficeAdvert] = useState([]);
  const [appointmentList , setAppointmentList] = useState([]);
  const [excludedTimes, setExcludedTimes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const paginate = 4; 
  const dateList = async(id) => {
    await officeData.officeAdvertResponse(id).then((data) => {
      console.log(data);
      setAppointmentList(data?.data);
      toast.success("Randevu tarihi başarıyla alındı.");
    }).catch((error) => { 
      console.log(error);
      toast.error("Randevu tarihi alınamadı.");
    })
  }

  useEffect(() => {
    if (officeDataDetail?.officeDataDetail) {
    dateList(officeDataDetail?.officeDataDetail?.userId)
    }
  }, [officeDataDetail?.officeDataDetail]);


  const [selectedDate, setSelectedDate] = useState(null);

  // Tarih seçildiğinde yapılacak işlemler
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Seçilen tarihle ilgili istediğiniz diğer işlemleri yapabilirsiniz
  };
  const apiDatesAndTimes = [
    '2023-12-10T09:00', '2023-12-15T14:30', '2023-12-20T16:45' // Örnek tarih ve saatler
  ];
  const excludeDatesAndTimes = apiDatesAndTimes.map(dateTime => new Date(dateTime));
  
  const excludeTimesForSelectedDate = () => {
    if (!selectedDate) {
      return [];
    }

    const selectedDateStr = selectedDate.toISOString().split('T')[0]; // Seçilen tarihin ISO formatlı string halini al

    // Eğer seçilen tarih listedeki tarihlerden biriyle eşleşiyorsa, o tarihe ait saatleri hariç tut
    const index = appointmentList.indexOf(selectedDateStr);//sadece zamanları almalısın
    if (index !== -1) {
      return [appointmentList[index]];
    }

    return [];
  };
  return (
  
  
    <>
      {officeAdvert.map((item) => (
        <div className="col-lg-12" key={item._id}>
          <div className="feat_property list style2 hvr-bxshd bdrrn mb10 mt20">
            <div className="thumb">
              {/* <Image
                width={275}
                height={240}
                // className="img-whp contain"
                src={item.advertCoverPhoto}
                alt={item.advertCoverPhoto}
              /> */}
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()} // Geçmiş tarihlerin seçilmesini engeller
                placeholderText="Tarih ve saat seçin"
                filterDate={date => date.getDay() !== 6 && date.getDay() !== 0}
              />
            </div>

            <div className="details">
              <div className="tc_content">
                <div className="dtls_headr">
                  <Link
                    href={`/ilan-detay/${item.advertNo}`}
                    className="fp_price"
                  >
                     {item?.advertPrice ? currencyFormatter.format(Number(item?.advertPrice), {thousandsSeparator: '.', decimalDigits: 0}) : 0 } TL
                  </Link>
                </div>
                <p className="text-thm">{item.advertType}</p>
                <h4>
                  {" "}
                  <Link href={`/ilan-detay/${item.advertNo}`}>
                    {item.advertTitle}
                  </Link>
                </h4>
                <p>
                  <span className="flaticon-placeholder"></span>
                  {item.address}
                </p>
              </div>

              <div className="fp_footer">
                <ul className="fp_meta float-start mb0">
                  <li className="list-inline-item">
                    <a href="#">
                      <Image
                        width={40}
                        height={40}
                        src={item.advisorPhoto}
                        alt={item.advisorPhoto}
                      />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">{item.advisorName}</a>
                  </li>
                </ul>
                <div className="fp_pdate float-end">
                  {calculateTimeAgo(item.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {officeAdvert.length === 0 ? (
        <div className="row">
          <div className="col-lg-12 mt20">
          <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeIntervals={10}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()} // Geçmiş tarihlerin seçilmesini engeller
                placeholderText="Tarih ve saat seçin"
                //  excludeDates={appointmentList.map(date => new Date(date))}
                excludeTimes={appointmentList.map(date => new Date(date))}
                filterDate={date => date.getDay() !== 6 && date.getDay() !== 0}
                // filterTime={time => time.getHours() > 8 && time.getHours() < 20}//bunun üzerinden ilerlenebilinir
              />
            <p className="text-center"> </p>
            <p className="text-center"> </p>
            <p className="text-center"> </p>
            <p className="text-center"> </p>
            <p className="text-center"> </p>
            <p className="text-center"> </p>
          </div>
        </div>
      ) : (
        <>
          {officeAdvert.map((item) => (
            <div className="col-lg-12" key={item._id}>
              {/* Mevcut kodunuz */}
            </div>
          ))}
          <div className="row">
            <div className="col-lg-12 mt20">
              <div className="mbp_pagination">
                <Pagination
                  setPage={setPage}
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Listings;
