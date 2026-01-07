
import React, { useState, useEffect } from 'react';
import { Ghost, Zap, Moon, Sun, Play, Info, Share2, Heart, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { STRANGER_THINGS_DATA } from './constants';
import { ThemeMode, Episode, Season } from './types';
import VideoPlayer from './components/VideoPlayer';
import FloatingSpores from './components/FloatingSpores';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('normal');
  const [selectedSeason, setSelectedSeason] = useState<Season>(STRANGER_THINGS_DATA[0]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(STRANGER_THINGS_DATA[0].episodes[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // State cho danh sách yêu thích (lưu URL tập phim)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('st_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lưu yêu thích vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('st_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'normal' ? 'upside-down' : 'normal');
  };

  const handleSeasonChange = (seasonId: number) => {
    const season = STRANGER_THINGS_DATA.find(s => s.id === seasonId);
    if (season) {
      setSelectedSeason(season);
      setSelectedEpisode(season.episodes[0]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFavorite = () => {
    const url = selectedEpisode.url;
    setFavorites(prev => 
      prev.includes(url) 
        ? prev.filter(item => item !== url) 
        : [...prev, url]
    );
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const isValidUrl = currentUrl.startsWith('http');

    const shareData = {
      title: `Stranger Things VN - ${selectedSeason.title} ${selectedEpisode.title}`,
      text: `Đang xem Stranger Things: ${selectedEpisode.description}`,
      url: isValidUrl ? currentUrl : 'https://www.netflix.com/title/80057281',
    };

    try {
      // Luôn cố gắng sao chép vào clipboard trước để đảm bảo có thông báo
      await navigator.clipboard.writeText(currentUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      if (navigator.share && isValidUrl) {
        await navigator.share(shareData);
      }
    } catch (err) {
      console.error('Lỗi khi thực hiện chia sẻ:', err);
      // Nếu lỗi nhưng chưa hiện toast thì hiện (trường hợp clipboard bị lỗi)
      if (!showToast) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const isFavorited = favorites.includes(selectedEpisode.url);

  const bgGradient = theme === 'normal' 
    ? 'bg-[#050505]' 
    : 'bg-[#0a1122]';

  const textColor = theme === 'normal' ? 'text-red-600' : 'text-blue-400';
  const accentColor = theme === 'normal' ? 'text-white' : 'text-blue-100';

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${bgGradient} selection:bg-red-600 selection:text-white pb-10`}>
      {theme === 'upside-down' && <FloatingSpores />}
      
      {/* Toast Notification */}
      <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 pointer-events-none ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className={`px-6 py-3 rounded-full border-2 flex items-center gap-3 backdrop-blur-md shadow-2xl ${theme === 'normal' ? 'bg-red-950/90 border-red-600 text-white red-glow' : 'bg-blue-950/90 border-blue-600 text-white blue-glow'}`}>
          <CheckCircle2 size={20} className={theme === 'normal' ? 'text-red-500' : 'text-blue-400'} />
          <span className="font-bold tracking-tight text-sm uppercase retro-font">Đã sao chép liên kết!</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-2 border-b border-white/5' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className={`stranger-font text-3xl md:text-5xl font-bold cursor-pointer transition-all duration-700 ${theme === 'normal' ? 'text-red-600 red-glow' : 'text-blue-600 blue-glow'}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              STRANGER THINGS
            </h1>
            <div className="hidden md:flex gap-6 items-center">
              {STRANGER_THINGS_DATA.map(season => (
                <button
                  key={season.id}
                  onClick={() => handleSeasonChange(season.id)}
                  className={`text-sm font-bold tracking-widest hover:text-red-500 transition-colors ${selectedSeason.id === season.id ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-gray-400'}`}
                >
                  {season.title.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full border-2 transition-all duration-700 transform hover:scale-110 ${theme === 'normal' ? 'border-red-600/50 hover:border-red-600 hover:bg-red-600/10' : 'border-blue-600/50 hover:border-blue-600 hover:bg-blue-600/10'}`}
              title={theme === 'normal' ? 'Entering the Upside Down' : 'Back to Hawkins'}
            >
              {theme === 'normal' ? <Ghost size={24} className="text-red-600" /> : <Zap size={24} className="text-blue-400 flicker" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Hero Section with Player */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group">
               <VideoPlayer url={selectedEpisode.url} theme={theme} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div>
                  <h2 className={`text-2xl md:text-4xl font-bold ${accentColor} mb-2`}>
                    {selectedSeason.title} - {selectedEpisode.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Play size={14} className="text-red-600" /> Netflix Original</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> 2016 - 2025</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> ~50m - 150m</span>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">TV-14</span>
                  </div>
                </div>
                
                {/* Dynamic Episode Description */}
                <div className="relative overflow-hidden pt-2">
                  <div key={selectedEpisode.url} className="animate-in fade-in slide-in-from-left-4 duration-700">
                    <p className={`text-gray-300 leading-relaxed max-w-3xl italic border-l-2 pl-4 transition-colors duration-1000 ${theme === 'normal' ? 'border-red-600/50' : 'border-blue-600/50'}`}>
                      {selectedEpisode.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto shrink-0">
                <button 
                  onClick={handleFavorite}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 font-bold rounded-sm transition-all shadow-lg ${isFavorited ? 'bg-white text-red-600' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/20'}`}
                >
                  <Heart size={18} fill={isFavorited ? "currentColor" : "none"} /> {isFavorited ? 'Đã thích' : 'Yêu thích'}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-sm transition-all backdrop-blur-sm"
                >
                  <Share2 size={18} /> Chia sẻ
                </button>
              </div>
            </div>

            <div className={`p-4 rounded border border-white/5 transition-colors duration-1000 ${theme === 'normal' ? 'bg-red-950/5' : 'bg-blue-950/10'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${textColor}`}>
                <Info size={14}/> Giới thiệu phim
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hawkins, Indiana, thập niên 1980. Khi một cậu bé mất tích, thị trấn nhỏ phát hiện ra một bí ẩn liên quan đến các thí nghiệm bí mật, các lực lượng siêu nhiên đáng sợ và một cô bé kỳ lạ với năng lực tâm linh Eleven. Một bức thư tình gửi đến các bộ phim kinh dị và viễn tưởng thập niên 80.
              </p>
            </div>
          </div>

          {/* Sidebar: Episode List */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg border-2 h-full flex flex-col overflow-hidden transition-all duration-700 ${theme === 'normal' ? 'border-red-600/30 bg-black/40' : 'border-blue-900/40 bg-blue-950/20'}`}>
              <div className={`p-4 border-b transition-colors duration-700 ${theme === 'normal' ? 'border-red-600/30 bg-red-950/20' : 'border-blue-900/40 bg-blue-900/20'}`}>
                <h3 className={`font-bold uppercase tracking-widest flex items-center gap-2 ${textColor}`}>
                  <Play size={18} fill="currentColor" /> Danh sách tập phim
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[60vh] lg:max-h-none scrollbar-thin">
                {selectedSeason.episodes.map((episode, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedEpisode(episode)}
                    className={`w-full flex items-center gap-4 p-4 text-left transition-all group border-b border-white/5 last:border-0 ${selectedEpisode.url === episode.url ? (theme === 'normal' ? 'bg-red-600/20 border-l-4 border-red-600' : 'bg-blue-600/20 border-l-4 border-blue-600') : 'hover:bg-white/5'}`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-gray-500 font-mono text-sm group-hover:text-white transition-colors shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className={`font-bold text-sm truncate ${selectedEpisode.url === episode.url ? 'text-white' : 'text-gray-400'} group-hover:text-white`}>
                        {episode.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 uppercase truncate">Season {selectedSeason.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {favorites.includes(episode.url) && <Heart size={10} className="text-red-500" fill="currentColor" />}
                      <Play size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${theme === 'normal' ? 'text-red-600' : 'text-blue-400'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Explore Seasons */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className={`h-[2px] flex-1 ${theme === 'normal' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
            <h2 className={`stranger-font text-4xl font-bold tracking-tighter ${textColor}`}>CÁC MÙA PHIM</h2>
            <div className={`h-[2px] flex-1 ${theme === 'normal' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {STRANGER_THINGS_DATA.map(season => (
              <div 
                key={season.id}
                onClick={() => handleSeasonChange(season.id)}
                className="group cursor-pointer relative"
              >
                <div className={`relative aspect-[2/3] overflow-hidden rounded-md border-2 transition-all duration-500 group-hover:scale-105 ${selectedSeason.id === season.id ? (theme === 'normal' ? 'border-red-600 shadow-lg shadow-red-600/30' : 'border-blue-600 shadow-lg shadow-blue-600/30') : 'border-transparent'}`}>
                  <img 
                    src={season.poster} 
                    alt={season.title}
                    className={`w-full h-full object-cover transition-all duration-1000 ${theme === 'upside-down' ? 'grayscale brightness-50 contrast-125' : 'grayscale-0'}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className={`text-xs font-bold tracking-widest uppercase ${theme === 'normal' ? 'text-red-500' : 'text-blue-400'}`}>Season {season.id}</p>
                    <h4 className="text-white font-bold leading-tight">{season.title}</h4>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="text-white drop-shadow-lg" size={48} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts Section */}
        <section className={`p-8 rounded-xl border-2 mb-20 transition-all duration-1000 ${theme === 'normal' ? 'border-red-600/20 bg-red-950/10' : 'border-blue-900/30 bg-blue-950/20'}`}>
          <h3 className={`stranger-font text-3xl mb-6 flex items-center gap-3 ${textColor}`}>
            <Info /> BẠN CÓ BIẾT?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
            <div className="space-y-4">
              <p className="flex gap-3">
                <span className={`font-bold ${textColor}`}>01.</span>
                Bộ phim lấy cảm hứng từ các thí nghiệm thực tế của chính phủ Mỹ mang tên Project MKUltra trong thời kỳ Chiến tranh Lạnh.
              </p>
              <p className="flex gap-3">
                <span className={`font-bold ${textColor}`}>02.</span>
                Hai anh em nhà Duffer (đạo diễn) đã bị hơn 15 hãng phim từ chối trước khi Netflix đồng ý sản xuất.
              </p>
            </div>
            <div className="space-y-4">
              <p className="flex gap-3">
                <span className={`font-bold ${textColor}`}>03.</span>
                Giao diện trang web này có "The Upside Down" mode - Hãy thử nhấn vào biểu tượng bóng ma phía trên để khám phá thế giới song song!
              </p>
              <p className="flex gap-3">
                <span className={`font-bold ${textColor}`}>04.</span>
                Millie Bobby Brown (Eleven) đã phải cạo đầu thật để đóng phần 1, và cô ấy đã lấy cảm hứng từ nhân vật Furiosa trong Mad Max.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t transition-all duration-1000 ${theme === 'normal' ? 'border-red-600/30 bg-black' : 'border-blue-900/30 bg-[#02050a]'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className={`stranger-font text-4xl font-bold mb-4 ${theme === 'normal' ? 'text-red-600 red-glow' : 'text-blue-600 blue-glow'}`}>STRANGER THINGS</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xl mx-auto">
            Trang web dành cho người hâm mộ tại Việt Nam. Không bản quyền. Tất cả hình ảnh và video thuộc về Netflix và các bên liên quan.
          </p>
          <div className="text-gray-600 text-[10px] tracking-widest uppercase">
            &copy; 1983-2025 Hawkins National Laboratory. All Rights Reserved.
          </div>
        </div>
      </footer>
      
      {/* Theme Switcher Hint */}
      <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-tighter transition-all duration-1000 ${theme === 'normal' ? 'border-red-600/20 bg-black text-red-600' : 'border-blue-600/20 bg-black text-blue-600 animate-pulse'}`}>
        <div className={`w-2 h-2 rounded-full ${theme === 'normal' ? 'bg-red-600' : 'bg-blue-600'}`} />
        {theme === 'normal' ? 'HAWKINS, INDIANA' : 'THE UPSIDE DOWN'}
      </div>
    </div>
  );
};

export default App;
