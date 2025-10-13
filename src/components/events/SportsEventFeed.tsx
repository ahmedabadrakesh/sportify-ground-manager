import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "../layouts/MainLayout";
import SEOHead from "../SEOHead";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
  enclosure?: {
    link: string;
    type: string;
  };
}

const SportsEventFeed = ({ isHomePage }: { isHomePage: boolean }) => {
  const [articles, setArticles] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const RSS_FEEDS = [
    "https://feeds.feedburner.com/ndtvsports-latest",
    "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
    "https://www.thehansindia.com/sports/feed",
    "https://www.simplysport.in/blog-feed.xml",
  ];

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchFeed = async () => {
    try {
      setLoading(true);

      // Fetch all feeds in parallel
      const feedPromises = RSS_FEEDS.map((feedUrl) =>
        fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            feedUrl
          )}`
        )
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Error fetching ${feedUrl}:`, err);
            return { status: "error", items: [] };
          })
      );

      const results = await Promise.all(feedPromises);
      const newsCountForEverySite = isHomePage ? 1 : 10;
      // Get first 10 items from each feed and combine
      const allArticles: FeedItem[] = [];
      results.forEach((data) => {
        if (data.status === "ok" && data.items) {
          allArticles.push(...data.items.slice(0, newsCountForEverySite));
        }
      });

      // Shuffle the combined articles
      const shuffledArticles = shuffleArray(allArticles);

      setArticles(shuffledArticles);
      setLastUpdate(new Date());
      toast({
        title: "Feed Updated",
        description: `Loaded ${shuffledArticles.length} articles from ${RSS_FEEDS.length} sources`,
      });
    } catch (error) {
      console.error("Error fetching feeds:", error);
      toast({
        title: "Error",
        description: "Failed to load sports news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();

    // Update twice daily: at 8 AM and 8 PM
    const scheduleNextUpdate = () => {
      const now = new Date();
      const hour = now.getHours();

      let nextUpdate = new Date();
      if (hour < 8) {
        nextUpdate.setHours(8, 0, 0, 0);
      } else if (hour < 20) {
        nextUpdate.setHours(20, 0, 0, 0);
      } else {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
        nextUpdate.setHours(8, 0, 0, 0);
      }

      const timeUntilUpdate = nextUpdate.getTime() - now.getTime();

      setTimeout(() => {
        fetchFeed();
        scheduleNextUpdate();
      }, timeUntilUpdate);
    };

    scheduleNextUpdate();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div>
      <SEOHead
        title="Sports Professionals & Coaches | Jokova"
        description="Find certified sports professionals and coaches for cricket, football, tennis, badminton and more. Book training sessions with experienced sports coaches."
        keywords="sports news"
        canonicalUrl="https://jokova.com/sports-news"
      />
      {/* Main Content */}
      <div className="mx-auto max-w-7xl">
        {/* Last Update Info */}
        {lastUpdate && !isHomePage && (
          <div className="flex bg-muted/50 border-b">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last updated: {lastUpdate.toLocaleString()}</span>
                <Badge variant="outline" className="ml-2">
                  Updates twice daily
                </Badge>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchFeed}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        )}

        {/* Content */}
        <main className="container mx-auto px-4 py-8 text-left">
          {loading && articles.length === 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              {articles.map((article, index) => {
                const imageUrl = article.enclosure?.link || article.thumbnail;

                return (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 hover:border-[hsl(var(--sports-primary))] overflow-hidden"
                  >
                    {imageUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg group-hover:text-[hsl(var(--sports-primary))] transition-colors">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.pubDate)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {stripHtml(article.description)}
                      </p>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--sports-primary))] hover:underline"
                      >
                        Read more
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>

        {!isHomePage && (
          <>
            <div className="text-lg font-semibold text-left">
              Sports Feed Credits
            </div>
            <div className="flex flex-row text-left underline gap-4">
              <a href="https://feeds.feedburner.com/ndtvsports-latest">
                NDTV Sports
              </a>
              |
              <a href="https://timesofindia.indiatimes.com/rssfeeds/4719148.cms">
                Times Of India
              </a>
              |
              <a href="https://www.thehansindia.com/sports/feed">
                The Hans India
              </a>
              |
              <a href="https://www.simplysport.in/blog-feed.xml">
                Simply Sport
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
  //   return (
  //     <div className="container min-h-screen bg-background">
  //       {/* Hero Section */}
  //       <div className="container bg-background border-b">
  //         <div className="grid md:grid-cols-8 mx-auto text-left py-4 max-w-7xl">
  //           <div className="c mb-6 col-span-6">
  //             <h1 className="text-3xl font-bold text-foreground mb-2">
  //               Sports News
  //             </h1>
  //             <p className="text-muted-foreground">
  //               Browse through latest abot Sports
  //             </p>
  //           </div>

  //           <div className="md:col-span-2 justify-center text-right">
  //             <Button
  //               variant="secondary"
  //               size="sm"
  //               onClick={fetchFeed}
  //               disabled={loading}
  //               className="gap-2"
  //             >
  //               <RefreshCw
  //                 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
  //               />
  //               Refresh
  //             </Button>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Last Update Info */}
  //       {lastUpdate && (
  //         <div className="bg-muted/50 border-b">
  //           <div className="container mx-auto px-4 py-2">
  //             <div className="flex items-center gap-2 text-sm text-muted-foreground">
  //               <Clock className="h-4 w-4" />
  //               <span>Last updated: {lastUpdate.toLocaleString()}</span>
  //               <Badge variant="outline" className="ml-2">
  //                 Updates twice daily
  //               </Badge>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //     {/* Content */}
  //     <main className="container mx-auto px-4 py-8 text-left">
  //       {loading && articles.length === 0 ? (
  //         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //           {[...Array(6)].map((_, i) => (
  //             <Card key={i}>
  //               <CardHeader>
  //                 <Skeleton className="h-6 w-3/4" />
  //                 <Skeleton className="h-4 w-1/2 mt-2" />
  //               </CardHeader>
  //               <CardContent>
  //                 <Skeleton className="h-20 w-full" />
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       ) : articles.length === 0 ? (
  //         <div className="text-center py-12">
  //           <p className="text-muted-foreground">No articles found</p>
  //         </div>
  //       ) : (
  //         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //           {articles.map((article, index) => {
  //             const imageUrl = article.enclosure?.link || article.thumbnail;

  //             return (
  //               <Card
  //                 key={index}
  //                 className="group hover:shadow-lg transition-all duration-300 hover:border-[hsl(var(--sports-primary))] overflow-hidden"
  //               >
  //                 {imageUrl && (
  //                   <div className="aspect-video w-full overflow-hidden bg-muted">
  //                     <img
  //                       src={imageUrl}
  //                       alt={article.title}
  //                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  //                       loading="lazy"
  //                     />
  //                   </div>
  //                 )}
  //                 <CardHeader>
  //                   <CardTitle className="line-clamp-2 text-lg group-hover:text-[hsl(var(--sports-primary))] transition-colors">
  //                     {article.title}
  //                   </CardTitle>
  //                   <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
  //                     <Clock className="h-3 w-3" />
  //                     {formatDate(article.pubDate)}
  //                   </div>
  //                 </CardHeader>
  //                 <CardContent>
  //                   <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
  //                     {stripHtml(article.description)}
  //                   </p>
  //                   <a
  //                     href={article.link}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                     className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--sports-primary))] hover:underline"
  //                   >
  //                     Read more
  //                     <ExternalLink className="h-3 w-3" />
  //                   </a>
  //                 </CardContent>
  //               </Card>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </main>

  //     <div className="text-lg font-semibold text-left">Sports Feed Credits</div>
  //     <div className="flex flex-row text-left underline gap-4">
  //       <a href="https://feeds.feedburner.com/ndtvsports-latest">NDTV Sports</a>
  //       |
  //       <a href="https://timesofindia.indiatimes.com/rssfeeds/4719148.cms">
  //         Times Of India
  //       </a>
  //       |<a href="https://www.thehansindia.com/sports/feed">The Hans India</a>|
  //       <a href="https://www.simplysport.in/blog-feed.xml">Simply Sport</a>
  //     </div>
  //   </div>
  // );
};

export default SportsEventFeed;
