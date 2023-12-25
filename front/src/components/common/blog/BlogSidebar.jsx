import Categories from "./Categories";
import FeaturedListings from "../listing/FeaturedListings";
import SearchBox from "./SearchBox";
import TagList from "./TagList";
import Link from "next/link";
import { getCurrentUser } from "../../../utils/auth";
const BlogSidebar = ({blog, features, vitrinAdvert }) => {
  const user = getCurrentUser();
  return (
    <div className="blog-sidebar_widgets">
      {/* End .sidebar_search_widget */}

      {user && 
      user.type === "user" &&
      <div className="terms_condition_widget">
        <h4 className="title">Blog Sahibi Doktora/Ofise Ulaş</h4>
        <div className="widget_list">
          <Link href={`/doktora-yaz/${blog?.userId}`}> Mesaj Gönder</Link>
          {/* <Categories features={features} /> */}
        </div>
      </div>}
      {/* End .Categories widget */}
      {vitrinAdvert && vitrinAdvert?.lengt > 0 &&

        <div className="sidebar_feature_listing">
          <h4 className="title">Vitrin İlanları</h4>
          <FeaturedListings vitrinAdvert={vitrinAdvert} />
        </div>
      }

      {/* End .blog_tag_widget */}
    </div>
  );
};

export default BlogSidebar;
