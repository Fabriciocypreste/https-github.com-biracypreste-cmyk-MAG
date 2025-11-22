import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';
import { ListVideo, Save, RefreshCw, CheckCircle, AlertTriangle, Film, Tv, Wifi } from 'lucide-react';
import { getM3UUrl, setM3UUrl, syncM3UData } from '../../services/m3uService';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function M3UPlaylistPage() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const existingUrl = getM3UUrl();
    if (existingUrl) {
      setUrl(existingUrl);
    }
  }, []);

  const handleSync = async () => {
    setStatus('syncing');
    setMessage('Sincronizando... Isso pode levar alguns instantes.');
    try {
      setM3UUrl(url);
      const summary = await syncM3UData();
      setStatus('success');
      setMessage(`Sincronização concluída com sucesso! Total de ${summary.total} itens: ${summary.channels} canais, ${summary.movies} filmes e ${summary.series} séries.`);
    } catch (error) {
      setStatus('error');
      setMessage(`Falha na sincronização: ${(error as Error).message}. Verifique a URL e a configuração de CORS.`);
    }
  };

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <Breadcrumbs items={[{ label: 'Conteúdo' }, { label: 'Gerenciar M3U' }]} />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-600/20 rounded-lg">
                <ListVideo className="w-6 h-6 text-red-500" />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Gerenciar Playlist M3U</h1>
                <p className="text-gray-400 text-sm">Insira a URL da sua playlist M3U para sincronizar o conteúdo da plataforma.</p>
            </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl border border-white/10 shadow-xl p-8">
            <div className="space-y-4">
                <div>
                    <label htmlFor="m3u-url" className="block text-sm font-medium text-gray-300 mb-2">
                        URL da Playlist M3U
                    </label>
                    <input 
                        type="url"
                        id="m3u-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://exemplo.com/playlist.m3u"
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                    />
                </div>
                
                <div className="text-xs text-gray-500 bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>
                        <strong>Aviso de CORS:</strong> Se a URL M3U não tiver os cabeçalhos CORS corretos, a busca pode falhar. Usamos um proxy para tentar contornar isso, mas o sucesso não é garantizado.
                    </span>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        onClick={handleSync}
                        disabled={status === 'syncing' || !url}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'syncing' ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Salvar e Sincronizar
                    </button>
                </div>
            </div>
        </div>

        {message && (
             <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 border ${
                status === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-300' :
                status === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
                'bg-blue-900/20 border-blue-500/30 text-blue-300'
             }`}>
                {status === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                {status === 'error' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
                {status === 'syncing' && <RefreshCw className="w-5 h-5 flex-shrink-0 animate-spin" />}
                <p className="text-sm">{message}</p>
             </div>
        )}
      </div>
    </div>
  );
}
