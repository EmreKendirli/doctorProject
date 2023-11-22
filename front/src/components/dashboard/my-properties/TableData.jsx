import Image from "next/image";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import advertServices from "../../../services/adver-service";
import { useEffect, useState } from "react";
import imageLoader from "../../../utils/imageLoader";
import createAddresStr from "../../../utils/createAddresStr";
import currencyFormatter from "currency-formatter"
import AssignmetPopup from "./AssignmetPopup";
import MessagePopup from "./MessagePopup";
import { getCurrentUser } from "../../../utils/auth";

const TableData = ({ sorting, searchKey, page, setPage, totalPages, setTotalPages }) => {

  const [myProperties, setMyProperties] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [targetAdvert, setTargetAdvert] = useState([])
  const [popupStatus, setPopupStatus] = useState(false)
  const [messageStatus, setRejectMessageStatus] = useState(false)
  // const [modal, setModal] = useState(false)
  const [advertId, setAdvertId] = useState("")
  const [message, setMessage] = useState([])

  const currentUser = getCurrentUser();

  const getAllAdverts = async () => {
    setLoadingStatus(true)
    const res = advertServices
      .getAllAdvertList(sorting, page, searchKey)
      .then((res) => {
        setLoadingStatus(false)
        if (res.succedd && res.totalRecord) {
          setTotalPages(Math.ceil(res.totalRecord / 10))
        }

        if (res?.succedd && res?.data?.length) {
          setMyProperties(res.data)

        }
      })
      .catch((err) => console.log(err));
  };

  const getRejectMessage = async (id) => {
    setLoadingStatus(true)
    const res = advertServices
      .getRejectMessage(id)
      .then((res) => {
        setLoadingStatus(false)
        // if (res.succedd ) {
        //   setTotalPages(Math.ceil(res.totalRecord / 10))
        // }

        if (res?.succedd && res?.data?.length) {
          setMessage(res.data)

          console.log('advertDetail?.processName?.options', res.data)
        }
      })
      .catch((err) => console.log(err));
  };



  useEffect(() => {
    getAllAdverts()
  }, [sorting, searchKey, page])

  let theadConent = [
    "Genel Bilgiler",
    "Görülme",
    "Onay Durumu",
    "Yayın Durumu",
    "Eklenme Tarihi",
    "İşlemler",
  ];

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                <span className={i > 0 ? "d-flex justify-content-center" : ""} style={{ fontSize: 15 }}>{value}</span>
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}
        <tbody>
          {myProperties &&
            myProperties?.length > 0 &&
            myProperties?.map((item, i) => (
              <tr key={i}>
                <td scope="row">
                  <div className="feat_property list favorite_page style2">
                    <div className="thumb">
                      <Image
                        loader={imageLoader}
                        width={150}
                        height={220}
                        className="img-whp cover"
                        src={
                          item?.advertDetail?.coverPhoto?.value ||
                          "/assets/images/logo/logo-short.png"
                        }
                        alt={item?.advertDetail?.adverTitle?.value || 'İlanımız'}
                      />
                      <div
                        className=""
                        style={{
                          position: "absolute",
                          bottom: -5,
                          left: 10,
                        }}
                      >
                        <span className="status_tag badge">{item?.advertDetail?.processName?.options}</span>
                      </div>
                      {item?.advertDetail?.isCopy?.value &&
                        <div
                          className=""
                          style={{
                            position: "absolute",
                            right: 10,
                            top: 10
                          }}
                        >
                          <span className="status_tag badge">Kopya</span>
                        </div>
                      }
                    </div>
                    <div className="details">
                      <div className="tc_content pt-1">

                        <p>
                          İlan No : {item?.advertDetail?.advertNo?.value}
                        </p>
                        {item?.advertDetail?.isEncrypted?.value &&
                          <p>
                            İlan Şifresi: {item?.advertDetail?.advertPassword?.value}
                          </p>
                        }
                        <p>
                          İlan Fiyatı : {currencyFormatter.format(item?.advertDetail?.advertPrice?.value, { thousand: '.', precision: 0 }) || "-"} TL
                        </p>
                        <p>
                          İlan Tipi : {item?.advertDetail?.advertTypeName?.options}
                        </p>
                        <p>
                          İlan Ekleyen : {item?.advertDetail?.ownerName?.value}
                        </p>
                        <p>
                          İlan Adresi : {createAddresStr("", item?.advertDetail?.city?.options, item?.advertDetail?.district?.options, item?.advertDetail?.neighbourhood?.options)}
                        </p>

                      </div>
                    </div>
                  </div>
                </td>

                {/* End td */}

                <td>
                  <span className="d-flex justify-content-center">
                    <span className="status_tag badge">
                      {item?.numberOfAdvertClicks}
                    </span>
                  </span>
                </td>
                {/* End td */}

                <td>
                  <span className="d-flex justify-content-center">
                    <span className="status_tag badge">
                      {item?.advertDetail?.isBlock?.value ? "Onay Bekliyor" : "Onaylandı"}
                    </span>
                  </span>
                </td>
                {/* End td */}

                <td>
                  <span className="d-flex justify-content-center">
                    <span className="status_tag badge">
                      {item?.advertDetail?.isStatus?.value ? "Yayında" : "Yayında Değil"}
                    </span>
                  </span>
                </td>

                <td>
                  <span className="h5 d-flex justify-content-center">
                    {new Date(
                      item?.advertDetail?.createdAt?.value
                    ).toLocaleDateString("tr-TR")}
                  </span>
                </td>
                {/* End td */}

                <td>
                  <ul className="view_edit_delete_list mb0 d-flex flex-row justify-content-center">
                    {currentUser && currentUser?.role === 'officeAdmin' &&
                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Atama Yap"
                      >
                        <a href='#' onClick={() => {
                          if (Object.keys(item).length > 0 && Object.keys(item?.advertDetail).length > 0) {
                            const tmpArr = []
                            tmpArr.push(item?.advertDetail)
                            tmpArr.length && setTargetAdvert(tmpArr)
                            setPopupStatus(true)
                          }
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="2" stroke="#1C274C" stroke-width="1.5" />
                            <path d="M13 15C13 16.1046 13 17 9 17C5 17 5 16.1046 5 15C5 13.8954 6.79086 13 9 13C11.2091 13 13 13.8954 13 15Z" stroke="#1C274C" stroke-width="1.5" />
                            <path d="M22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C21.298 5.64118 21.5794 6.2255 21.748 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M19 12H15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M19 9H14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M19 15H16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                          </svg>

                        </a>
                      </li>

                    }
                    {item?.advertDetail?.rejectedAdvertStatus?.value &&

                      <li
                        className="list-inline-item"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Red Mesajları"
                      >
                        <a href='#' onClick={() => {

                          getRejectMessage(item?.advertDetail?._id?.value)

                          setRejectMessageStatus(true)

                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 2H4C3.44772 2 3 2.44772 3 3V19C3 19.5523 3.44772 20 4 20H16L21 23V20H21.5858C21.9473 20 22.2874 19.781 22.4871 19.448L23.9983 17.7787C24.5038 17.1988 24.3942 16.2823 23.7478 15.9162L19.6197 13.191C19.1809 12.9469 18.8354 12.5475 18.648 12.0836L17.738 9.47806C17.5824 9.09836 17.2588 8.83972 16.8588 8.77148L11 7V2.82843C11 2.36261 11.386 2 11.8284 2H11Z" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 11H16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 15H12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </a>
                      </li>
                    }
                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title={item?.advertDetail?.isStatus?.value ? "Yayından Kaldır" : "Yayına Al"}
                      onClick={() => {
                        Swal.fire({
                          title: item?.advertDetail?.isStatus?.value ? "İlanı yayından kaldırmak istediğinizden emin misiniz?" : "İlanı yayına almak istediğinizden emin misiniz?",
                          text: "Onaylıyor Musunuz!",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: item?.advertDetail?.isStatus?.value ? "Yayından Kaldır" : "Yayına Al",
                          cancelButtonText: "İptal",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await advertServices.toggleStatus(
                              item?.advertDetail?._id.value
                            ).then(res => {
                              if (res.succedd) {
                                Swal.fire({
                                  title: "Başarılı!",
                                  text: "İşlemi başarılı.",
                                  icon: "success",
                                  confirmButtonText: "Kapat",
                                });
                                getAllAdverts()
                              } else {
                                Swal.fire({
                                  title: "Hata!",
                                  text: "İşlem sırasında hata ile karşılaşıldı.",
                                  icon: "error",
                                  confirmButtonText: "Kapat",
                                });
                              }
                            });

                          }
                        }).catch(e => {
                          Swal.fire({
                            title: "Hata!",
                            text: "İşlem sırasında hata ile karşılaşıldı.",
                            icon: "error",
                            confirmButtonText: "Kapat",
                          });
                        });
                      }}
                    >
                      <a href="#">
                        {item?.advertDetail?.isStatus?.value ?
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2954 6.31083C22.6761 6.474 22.8524 6.91491 22.6893 7.29563L21.9999 7.00019C22.6893 7.29563 22.6894 7.29546 22.6893 7.29563L22.6886 7.29731L22.6875 7.2998L22.6843 7.30716L22.6736 7.33123C22.6646 7.35137 22.6518 7.37958 22.6352 7.41527C22.6019 7.48662 22.5533 7.58794 22.4888 7.71435C22.3599 7.967 22.1675 8.32087 21.9084 8.73666C21.4828 9.4197 20.8724 10.2778 20.0619 11.1304L21.0303 12.0987C21.3231 12.3916 21.3231 12.8665 21.0303 13.1594C20.7374 13.4523 20.2625 13.4523 19.9696 13.1594L18.969 12.1588C18.3093 12.7115 17.5528 13.2302 16.695 13.6564L17.6286 15.0912C17.8545 15.4383 17.7562 15.9029 17.409 16.1288C17.0618 16.3547 16.5972 16.2564 16.3713 15.9092L15.2821 14.2353C14.5028 14.4898 13.659 14.6628 12.7499 14.7248V16.5002C12.7499 16.9144 12.4141 17.2502 11.9999 17.2502C11.5857 17.2502 11.2499 16.9144 11.2499 16.5002V14.7248C10.3689 14.6647 9.54909 14.5004 8.78982 14.2586L7.71575 15.9093C7.48984 16.2565 7.02526 16.3548 6.67807 16.1289C6.33089 15.903 6.23257 15.4384 6.45847 15.0912L7.37089 13.689C6.5065 13.2668 5.74381 12.7504 5.07842 12.1984L4.11744 13.1594C3.82455 13.4523 3.34968 13.4523 3.05678 13.1594C2.76389 12.8665 2.76389 12.3917 3.05678 12.0988L3.98055 11.175C3.15599 10.3153 2.53525 9.44675 2.10277 8.75486C1.83984 8.33423 1.6446 7.97584 1.51388 7.71988C1.44848 7.59182 1.3991 7.48914 1.36537 7.41683C1.3485 7.38067 1.33553 7.35207 1.32641 7.33167L1.31562 7.30729L1.31238 7.29984L1.31129 7.29733L1.31088 7.29638C1.31081 7.2962 1.31056 7.29563 1.99992 7.00019L1.31088 7.29638C1.14772 6.91565 1.32376 6.474 1.70448 6.31083C2.08489 6.1478 2.52539 6.32374 2.68888 6.70381C2.68882 6.70368 2.68894 6.70394 2.68888 6.70381L2.68983 6.706L2.69591 6.71972C2.7018 6.73291 2.7114 6.7541 2.72472 6.78267C2.75139 6.83983 2.79296 6.92644 2.84976 7.03767C2.96345 7.26029 3.13762 7.58046 3.37472 7.95979C3.85033 8.72067 4.57157 9.70728 5.55561 10.6218C6.42151 11.4265 7.48259 12.1678 8.75165 12.656C9.70614 13.0232 10.7854 13.2502 11.9999 13.2502C13.2416 13.2502 14.342 13.013 15.3124 12.631C16.5738 12.1345 17.6277 11.3884 18.4866 10.5822C19.4562 9.67216 20.1668 8.69535 20.6354 7.9434C20.869 7.5685 21.0405 7.25246 21.1525 7.03286C21.2085 6.92315 21.2494 6.83776 21.2757 6.78144C21.2888 6.75328 21.2983 6.73242 21.3041 6.71943L21.31 6.70595L21.3106 6.70475C21.3105 6.70485 21.3106 6.70466 21.3106 6.70475M22.2954 6.31083C21.9147 6.14771 21.4738 6.32423 21.3106 6.70475L22.2954 6.31083ZM2.68888 6.70381C2.68882 6.70368 2.68894 6.70394 2.68888 6.70381V6.70381Z" fill="#1C274C" />
                          </svg>
                          :
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#1C274C" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z" fill="#1C274C" />
                          </svg>
                        }
                      </a>
                    </li>

                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Düzenle"
                    >
                      <a href={`/blog-guncelle/${item?.advertDetail?._id?.value}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C20.6516 2.93414 20.6516 3.40901 20.3588 3.7019C20.0659 3.9948 19.591 3.9948 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.994 19.6022 20.2048 18.5208 20.2414 15.9892C20.2474 15.575 20.588 15.2441 21.0022 15.2501C21.4163 15.2561 21.7472 15.5967 21.7412 16.0108C21.7061 18.4383 21.549 20.1685 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM18.1131 7.04556C19.1739 5.98481 20.8937 5.98481 21.9544 7.04556C23.0152 8.1063 23.0152 9.82611 21.9544 10.8869L17.1991 15.6422C16.9404 15.901 16.7654 16.076 16.5693 16.2289C16.3387 16.4088 16.0892 16.563 15.8252 16.6889C15.6007 16.7958 15.3659 16.8741 15.0187 16.9897L12.9351 17.6843C12.4751 17.8376 11.9679 17.7179 11.625 17.375C11.2821 17.0321 11.1624 16.5249 11.3157 16.0649L11.9963 14.0232C12.001 14.0091 12.0056 13.9951 12.0102 13.9813C12.1259 13.6342 12.2042 13.3993 12.3111 13.1748C12.437 12.9108 12.5912 12.6613 12.7711 12.4307C12.924 12.2346 13.099 12.0596 13.3578 11.8009C13.3681 11.7906 13.3785 11.7802 13.3891 11.7696L18.1131 7.04556ZM20.8938 8.10622C20.4188 7.63126 19.6488 7.63126 19.1738 8.10622L18.992 8.288C19.0019 8.32149 19.0132 8.3571 19.0262 8.39452C19.1202 8.66565 19.2988 9.02427 19.6372 9.36276C19.9757 9.70125 20.3343 9.87975 20.6055 9.97382C20.6429 9.9868 20.6785 9.99812 20.712 10.008L20.8938 9.8262C21.3687 9.35124 21.3687 8.58118 20.8938 8.10622ZM19.5664 11.1536C19.2485 10.9866 18.9053 10.7521 18.5766 10.4234C18.2479 10.0947 18.0134 9.75146 17.8464 9.43357L14.4497 12.8303C14.1487 13.1314 14.043 13.2388 13.9538 13.3532C13.841 13.4979 13.7442 13.6545 13.6652 13.8202C13.6028 13.9511 13.5539 14.0936 13.4193 14.4976L13.019 15.6985L13.3015 15.981L14.5024 15.5807C14.9064 15.4461 15.0489 15.3972 15.1798 15.3348C15.3455 15.2558 15.5021 15.159 15.6468 15.0462C15.7612 14.957 15.8686 14.8513 16.1697 14.5503L19.5664 11.1536ZM7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H10.5C10.9142 12.25 11.25 12.5858 11.25 13C11.25 13.4142 10.9142 13.75 10.5 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="#1C274C" />
                        </svg>
                      </a>
                    </li>
                    {/* End li */}

                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="İlanı Kopyala"
                      onClick={() => {
                        Swal.fire({
                          title: "İlanı kopyalamak istediğinizden emin misiniz?",
                          text: "Onaylıyor Musunuz!",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Kopyala",
                          cancelButtonText: "İptal",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await advertServices.duplicateAdvert(item?.advertDetail?._id.value).then(res => {
                              if (res && res.succedd) {
                                getAllAdverts();
                                Swal.fire({
                                  title: "Başarılı!",
                                  text: "Kopyalama işlemi başarılı bir şekilde gerçekleştirildi.",
                                  icon: "success",
                                  confirmButtonText: "Kapat",
                                });
                              } else {
                                Swal.fire({
                                  title: "Hata!",
                                  text: "Kopyalama işlemi sırasında hata ile karşılaşıldı",
                                  icon: "error",
                                  confirmButtonText: "Kapat",
                                });
                              }
                            }).catch(e => {
                              Swal.fire({
                                title: "Hata!",
                                text: "Kopyalama işlemi sırasında hata ile karşılaşıldı",
                                icon: "error",
                                confirmButtonText: "Kapat",
                              });
                            });
                          }
                        });
                      }}
                    >
                      <a href="#">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3939 2.02121L16.4604 2.03904C17.5598 2.33361 18.431 2.56704 19.1162 2.81458C19.8172 3.06779 20.3888 3.35744 20.8597 3.79847C21.5453 4.44068 22.0252 5.27179 22.2385 6.18671C22.385 6.81503 22.3501 7.45486 22.2189 8.18849C22.0906 8.90573 21.8572 9.77697 21.5626 10.8764L21.0271 12.8747C20.7326 13.974 20.4991 14.8452 20.2516 15.5305C19.9984 16.2314 19.7087 16.803 19.2677 17.2739C18.6459 17.9377 17.8471 18.4087 16.9665 18.6316C16.7093 19.2213 16.3336 19.7554 15.8597 20.1993C15.3888 20.6403 14.8172 20.9299 14.1162 21.1832C13.431 21.4307 12.5598 21.6641 11.4605 21.9587L11.394 21.9765C10.2946 22.2711 9.42337 22.5045 8.70613 22.6328C7.9725 22.764 7.33266 22.7989 6.70435 22.6524C5.78943 22.4391 4.95832 21.9592 4.31611 21.2736C3.87508 20.8027 3.58542 20.2311 3.33222 19.5302C3.08468 18.8449 2.85124 17.9737 2.55667 16.8743L2.02122 14.876C1.72664 13.7766 1.4932 12.9054 1.36495 12.1882C1.23376 11.4546 1.19881 10.8147 1.34531 10.1864C1.55864 9.27149 2.03849 8.44038 2.72417 7.79817C3.19505 7.35714 3.76664 7.06749 4.46758 6.81428C5.15283 6.56674 6.02404 6.3333 7.12341 6.03873L7.15665 6.02983C7.42112 5.95896 7.67134 5.89203 7.90825 5.82944C8.29986 4.43031 8.64448 3.44126 9.31611 2.72417C9.95831 2.03849 10.7894 1.55864 11.7043 1.34531C12.3327 1.19881 12.9725 1.23376 13.7061 1.36495C14.4233 1.49319 15.2945 1.72664 16.3939 2.02121ZM7.45502 7.5028C6.36214 7.79571 5.57905 8.00764 4.9772 8.22505C4.36778 8.4452 4.00995 8.64907 3.74955 8.89296C3.2804 9.33237 2.95209 9.90103 2.80613 10.527C2.72511 10.8745 2.72747 11.2863 2.84152 11.9242C2.95723 12.5712 3.17355 13.381 3.47902 14.521L3.99666 16.4529C4.30212 17.5929 4.51967 18.4023 4.74299 19.0205C4.96314 19.63 5.16701 19.9878 5.4109 20.2482C5.85031 20.7173 6.41897 21.0456 7.04496 21.1916C7.39242 21.2726 7.80425 21.2703 8.4421 21.1562C9.08915 21.0405 9.89893 20.8242 11.0389 20.5187C12.1789 20.2132 12.9884 19.9957 13.6066 19.7724C14.216 19.5522 14.5739 19.3484 14.8343 19.1045C14.9719 18.9756 15.0973 18.8357 15.2096 18.6865C15.0306 18.6612 14.8463 18.629 14.6557 18.5911C13.9839 18.4575 13.1769 18.2413 12.1808 17.9744L12.1234 17.959C11.024 17.6644 10.1528 17.431 9.46758 17.1835C8.76664 16.9302 8.19505 16.6406 7.72416 16.1996C7.03849 15.5574 6.55864 14.7262 6.34531 13.8113C6.19881 13.183 6.23376 12.5432 6.36494 11.8095C6.4932 11.0923 6.72664 10.2211 7.02122 9.12174L7.45502 7.5028ZM13.4421 2.84152C12.8042 2.72747 12.3924 2.72511 12.045 2.80613C11.419 2.95209 10.8503 3.2804 10.4109 3.74955C9.97479 4.21518 9.70642 4.93452 9.2397 6.64323C9.16384 6.92093 9.08365 7.22023 8.99665 7.54488L8.47902 9.47673C8.17355 10.6167 7.95723 11.4265 7.84152 12.0736C7.72747 12.7114 7.72511 13.1232 7.80613 13.4707C7.95209 14.0967 8.2804 14.6654 8.74955 15.1048C9.00995 15.3487 9.36778 15.5525 9.9772 15.7727C10.5954 15.996 11.4049 16.2136 12.5449 16.519C13.5703 16.7938 14.3303 16.997 14.9482 17.1199C15.5635 17.2422 15.981 17.2723 16.3232 17.23C16.3976 17.2209 16.4691 17.2082 16.5389 17.1919C17.1649 17.0459 17.7335 16.7176 18.1729 16.2485C18.4168 15.9881 18.6207 15.6303 18.8408 15.0208C19.0642 14.4026 19.2817 13.5932 19.5872 12.4532L20.1048 10.5213C20.4103 9.38129 20.6266 8.57151 20.7423 7.92446C20.8564 7.28661 20.8587 6.87479 20.7777 6.52733C20.6317 5.90133 20.3034 5.33267 19.8343 4.89327C19.5739 4.64937 19.216 4.4455 18.6066 4.22535C17.9884 4.00203 17.1789 3.78448 16.0389 3.47902C14.8989 3.17355 14.0892 2.95723 13.4421 2.84152ZM11.0524 9.80588C11.1596 9.40578 11.5709 9.16834 11.971 9.27555L16.8006 10.5696C17.2007 10.6768 17.4381 11.0881 17.3309 11.4882C17.2237 11.8883 16.8125 12.1257 16.4124 12.0185L11.5827 10.7244C11.1826 10.6172 10.9452 10.206 11.0524 9.80588ZM10.2755 12.7036C10.3828 12.3035 10.794 12.066 11.1941 12.1733L14.0919 12.9497C14.492 13.0569 14.7294 13.4682 14.6222 13.8683C14.515 14.2684 14.1038 14.5058 13.7037 14.3986L10.8059 13.6221C10.4058 13.5149 10.1683 13.1037 10.2755 12.7036Z" fill="#1C274C" />
                        </svg>

                      </a>
                    </li>
                    {/* End li */}


                    <li
                      className="list-inline-item"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Sil"
                      onClick={() => {
                        Swal.fire({
                          title: "İlan kaydını silmek istediğinize emin misiniz?",
                          text: "Bu işlemi geri alamazsınız!",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Sil",
                          cancelButtonText: "İptal",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await advertServices.deleteAdvert(item?.advertDetail?._id.value);
                            getAllAdverts();
                            Swal.fire({
                              title: "Başarılı!",
                              text: "Silme işlemi başarılı.",
                              icon: "success",
                              confirmButtonText: "Kapat",
                            });
                          }
                        });
                      }}
                    >
                      <a href="#">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff5a5f" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3094 2.25002H13.6908C13.9072 2.24988 14.0957 2.24976 14.2737 2.27819C14.977 2.39049 15.5856 2.82915 15.9146 3.46084C15.9978 3.62073 16.0573 3.79961 16.1256 4.00494L16.2373 4.33984C16.2562 4.39653 16.2616 4.41258 16.2661 4.42522C16.4413 4.90933 16.8953 5.23659 17.4099 5.24964C17.4235 5.24998 17.44 5.25004 17.5001 5.25004H20.5001C20.9143 5.25004 21.2501 5.58582 21.2501 6.00004C21.2501 6.41425 20.9143 6.75004 20.5001 6.75004H3.5C3.08579 6.75004 2.75 6.41425 2.75 6.00004C2.75 5.58582 3.08579 5.25004 3.5 5.25004H6.50008C6.56013 5.25004 6.5767 5.24998 6.59023 5.24964C7.10488 5.23659 7.55891 4.90936 7.73402 4.42524C7.73863 4.41251 7.74392 4.39681 7.76291 4.33984L7.87452 4.00496C7.94281 3.79964 8.00233 3.62073 8.08559 3.46084C8.41453 2.82915 9.02313 2.39049 9.72643 2.27819C9.90445 2.24976 10.093 2.24988 10.3094 2.25002ZM9.00815 5.25004C9.05966 5.14902 9.10531 5.04404 9.14458 4.93548C9.1565 4.90251 9.1682 4.86742 9.18322 4.82234L9.28302 4.52292C9.37419 4.24941 9.39519 4.19363 9.41601 4.15364C9.52566 3.94307 9.72853 3.79686 9.96296 3.75942C10.0075 3.75231 10.067 3.75004 10.3553 3.75004H13.6448C13.9331 3.75004 13.9927 3.75231 14.0372 3.75942C14.2716 3.79686 14.4745 3.94307 14.5842 4.15364C14.605 4.19363 14.626 4.2494 14.7171 4.52292L14.8169 4.82216L14.8556 4.9355C14.8949 5.04405 14.9405 5.14902 14.992 5.25004H9.00815Z" fill="#ff5a5f" />
                          <path d="M5.91509 8.45015C5.88754 8.03685 5.53016 7.72415 5.11686 7.7517C4.70357 7.77925 4.39086 8.13663 4.41841 8.54993L4.88186 15.5017C4.96736 16.7844 5.03642 17.8205 5.19839 18.6336C5.36679 19.4789 5.65321 20.185 6.2448 20.7385C6.8364 21.2919 7.55995 21.5308 8.4146 21.6425C9.23662 21.7501 10.275 21.7501 11.5606 21.75H12.4395C13.7251 21.7501 14.7635 21.7501 15.5856 21.6425C16.4402 21.5308 17.1638 21.2919 17.7554 20.7385C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9638 17.8206 19.0328 16.7844 19.1183 15.5017L19.5818 8.54993C19.6093 8.13663 19.2966 7.77925 18.8833 7.7517C18.47 7.72415 18.1126 8.03685 18.0851 8.45015L17.6251 15.3493C17.5353 16.6971 17.4713 17.6349 17.3307 18.3406C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 19.8989 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255 20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8989 7.26958 19.6431C6.99617 19.3873 6.80583 19.025 6.66948 18.3406C6.52892 17.6349 6.46489 16.6971 6.37503 15.3493L5.91509 8.45015Z" fill="#ff5a5f" />
                          <path d="M9.42546 10.2538C9.83762 10.2125 10.2052 10.5133 10.2464 10.9254L10.7464 15.9254C10.7876 16.3376 10.4869 16.7051 10.0747 16.7463C9.66256 16.7875 9.29503 16.4868 9.25381 16.0747L8.75381 11.0747C8.7126 10.6625 9.01331 10.295 9.42546 10.2538Z" fill="#ff5a5f" />
                          <path d="M14.5747 10.2538C14.9869 10.295 15.2876 10.6625 15.2464 11.0747L14.7464 16.0747C14.7052 16.4868 14.3376 16.7875 13.9255 16.7463C13.5133 16.7051 13.2126 16.3376 13.2538 15.9254L13.7538 10.9254C13.795 10.5133 14.1626 10.2125 14.5747 10.2538Z" fill="#ff5a5f" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </td>
                {/* End td */}
              </tr>
            ))}
        </tbody>
      </table>
      {loadingStatus && (


        <div className="d-flex justify-content-center w-100 text-dark h2">
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Yükleniyor...
        </div>
      )}
      {myProperties?.length === 0 && !loadingStatus && (
        <div className="d-flex justify-content-center w-100 text-dark h2">
          Kayıtlı İlan Bulunmamaktadır
        </div>
      )}

      {messageStatus && <MessagePopup message={message} setAdvertInfo={setTargetAdvert} status={messageStatus} setStatus={setRejectMessageStatus} reloadAdvertList={getAllAdverts} />}
      {popupStatus && <AssignmetPopup advertInfo={targetAdvert} setAdvertInfo={setTargetAdvert} status={popupStatus} setStatus={setPopupStatus} reloadAdvertList={getAllAdverts} />}
    </>
  );
};

export default TableData;

