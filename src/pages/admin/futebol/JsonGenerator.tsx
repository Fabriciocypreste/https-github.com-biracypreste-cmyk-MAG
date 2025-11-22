import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/shared/Breadcrumbs';
import { Download, Copy, RefreshCw, FileJson, Check } from 'lucide-react';
import { getAllTeams, getUpcomingMatches, getStandings } from '../../../services/futebolApi';

export default function JsonGenerator() {
  const [selectedModule, setSelectedModule] = useState('serie-a');
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedJson('');
    try {
      let dataToGenerate: object;

      switch (selectedModule) {
        case 'serie-a':
          const [teams, matches, standings] = await Promise.all([
            getAllTeams(),
            getUpcomingMatches(),
            getStandings()
          ]);
          dataToGenerate = {
            updated_at: new Date().toISOString(),
            competition: selectedModule,
            teams,
            matches,
            standings
          };
          break;

        case 'libertadores':
        case 'selecao':
          dataToGenerate = {
            updated_at: new Date().toISOString(),
            competition: selectedModule,
            status: 'not_implemented',
            message: `A geração de dados para '${selectedModule}' ainda não foi implementada.`
          };
          break;
        
        case 'all':
           const [allTeams, allMatches, allStandings] = await Promise.all([
            getAllTeams(),
            getUpcomingMatches(),
            getStandings()
          ]);
          dataToGenerate = {
            updated_at: new Date().toISOString(),
            data: {
              'serie-a': {
                teams: allTeams,
                matches: allMatches,
                standings: allStandings,
              },
              'libertadores': {
                status: 'not_implemented',
              },
              'selecao': {
                status: 'not_implemented'
              }
            }
          };
          break;

        default:
          dataToGenerate = { error: 'Módulo inválido selecionado.' };
      }
      setGeneratedJson(JSON.stringify(dataToGenerate, null, 2));

    } catch (error) {
        console.error("Failed to generate JSON:", error);
        setGeneratedJson(JSON.stringify({ error: 'Falha ao buscar dados da API.', details: (error as Error).message }, null, 2));
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedJson) return;
    navigator.clipboard.writeText(generatedJson).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!generatedJson) return;
    const blob = new Blob([generatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedModule}_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <Breadcrumbs items={[{ label: 'Futebol' }, { label: 'Gerador JSON' }]} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Gerador de Dados (JSON)</h1>
          <p className="text-gray-400">Gere arquivos estáticos atualizados para alimentar os aplicativos de TV e Mobile.</p>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden">
            {/* Controls */}
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-white/5">
                <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Módulo de Dados</label>
                    <select 
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 outline-none"
                    >
                        <option value="serie-a">Campeonato Brasileiro Série A</option>
                        <option value="libertadores">Copa Libertadores</option>
                        <option value="selecao">Seleção Brasileira</option>
                        <option value="all">Todos (Backup Completo)</option>
                    </select>
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
                    {isGenerating ? 'Gerando...' : 'Gerar JSON'}
                </button>
            </div>

            {/* Preview Area */}
            <div className="p-0 relative">
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button onClick={handleCopy} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-50" title={copySuccess ? "Copiado!" : "Copiar"} disabled={!generatedJson}>
                        {copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={handleDownload} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-50" title="Download" disabled={!generatedJson}>
                        <Download className="w-4 h-4" />
                    </button>
                </div>
                <textarea 
                    readOnly
                    value={generatedJson || '// Selecione um módulo e clique em Gerar para visualizar o resultado.'}
                    className="w-full h-[500px] bg-[#0F0F0F] p-6 font-mono text-sm text-green-400 resize-none focus:outline-none"
                    placeholder="// Selecione um módulo e clique em Gerar para visualizar o resultado."
                />
            </div>
        </div>
      </div>
    </div>
  );
}