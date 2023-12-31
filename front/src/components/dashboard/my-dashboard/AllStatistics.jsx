const AllStatistics = ({ dashboardData }) => {
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-home",
      timer: dashboardData?.totalNumberOfAdverts || "5",
      name: "Bloglarım",
    },
    {
      id: 2,
      blockStyle: "style2",
      icon: "flaticon-view",
      timer: dashboardData?.totalNumberOfAdvertsClicks || "7",
      name: "Görüntülenme",
    },
    {
      id: 3,
      blockStyle: "style3",
      icon: "flaticon-chat",
      timer: dashboardData?.totalAdvertMessage || "2",
      name: "Blog Mesajları",
    }
  ];

  return (
    <>
      {allStatistics.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{item.timer}</div>
              <p>{item.name}</p>
            </div>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllStatistics;