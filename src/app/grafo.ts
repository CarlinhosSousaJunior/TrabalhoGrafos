declare var Viva: any;

export class Grafo {
    public V: any[];
    public matrizAdj: any[];
    public listaAdj: any[];
    public isOrientado: boolean;
    public isPonderado: boolean;
    public vetorDeCores: string[] = [
        '#4286f4',
        '#b23021',
        '#46a354',
        '#f4e542',
        '#8933cc',
        '#bc1c94',
        '#db771a',
        '#21c4b4',
        '#71c11b',
        '#726f6f',
        '#000000'
    ];

    constructor(isOrientado?: boolean, isPonderado?: boolean) {
        this.V = [];
        this.matrizAdj = [];
        this.listaAdj = [];
        this.isOrientado = isOrientado;
        this.isPonderado = isPonderado;
    }

    public inserirVertice(nome) {
        //Insere o vertice no conjunto dos vertices.
        this.V.push(nome);
        //Adiciona uma nova linha na matriz.
        this.matrizAdj.push([]);
        //Adiciona uma nova linha na lista.
        this.listaAdj.push([]);
        //Preenche a nova linha da matriz com zero de acordo com a quantidade de vertices.
        for (var i = 0; i < this.matrizAdj.length; i++)
            for (var j = this.matrizAdj[i].length; j < this.V.length; j++)
                this.matrizAdj[i].push(0);
    }

    public removerVertice(nome) {
        //Pega o indice do vertice com o nome correspondente ao do parametro.
        var index = this.V.findIndex(function (vertice) { return vertice == nome });
        if (index > -1) {
            //Remove o vertice do conjunto de vertices.
            this.V.splice(index, 1);
            //Remove vertice da matriz.
            this.matrizAdj.splice(index, 1);
            this.matrizAdj.forEach(function (col, i) {
                col.splice(i, 1);
            });
            //Remove vertice da lista.
            this.listaAdj.splice(index, 1);
            this.listaAdj.forEach(function (linha) {
                linha.forEach(function (elemento, i) {
                    if (elemento == nome)
                        elemento.splice(i, 1);
                });
            });
        }
    }

    public inserirAresta(origem: any, destino: any, peso?: any) {
        if (this.isOrientado) return this.inserirArco(origem, destino);
        //Busca os indices correspondentes a cada uma das vertices.
        let indexVerticeOrigem = this.V.findIndex(function (vertice) { return vertice == origem });
        let indexVerticeDestino = this.V.findIndex(function (vertice) { return vertice == destino });
        //Define os valores da matriz.
        this.matrizAdj[indexVerticeOrigem][indexVerticeDestino] = peso || 1;
        this.matrizAdj[indexVerticeDestino][indexVerticeOrigem] = peso || 1;
        //Define os valores na lista.
        this.listaAdj[indexVerticeOrigem].push(peso ? { vertice: destino, peso: peso } : destino);
        this.listaAdj[indexVerticeDestino].push(peso ? { vertice: origem, peso: peso } : origem);
    }

    public removerAresta(origem: any, destino: any) {
        if (this.isOrientado) return this.removerArco(origem, destino);
        //Busca os indices correspondentes a cada uma das vertices. 
        let indexVerticeOrigem = this.V.findIndex(function (vertice) { return vertice == origem });
        let indexVerticeDestino = this.V.findIndex(function (vertice) { return vertice == destino });
        //Define os valores da matriz.
        this.matrizAdj[indexVerticeOrigem][indexVerticeDestino] = 0;
        this.matrizAdj[indexVerticeDestino][indexVerticeOrigem] = 0;
        //Busca o indice dos vertices a serem removidos dentro da lista.
        let verticeOrigemIndex = this.listaAdj[indexVerticeOrigem].findIndex(function (vertice) { return vertice == destino });
        let verticeDestinoIndex = this.listaAdj[indexVerticeDestino].findIndex(function (vertice) { return vertice == origem });
        //Remove os vertices que possuem relação da lista.
        this.listaAdj[indexVerticeOrigem].splice(verticeOrigemIndex, 1);
        this.listaAdj[indexVerticeDestino].splice(verticeDestinoIndex, 1);
    }

    public inserirArco(origem: any, destino: any, peso?: any) {
        if (!this.isOrientado) return this.inserirAresta(origem, destino);
        //Busca os indices correspondentes a cada uma das vertices. 
        let indexVerticeOrigem = this.V.findIndex(function (vertice) { return vertice == origem });
        let indexVerticeDestino = this.V.findIndex(function (vertice) { return vertice == destino });
        //Insere o arco na matriz.
        this.matrizAdj[indexVerticeOrigem][indexVerticeDestino] = peso || 1;
        //Insere o arco na lista.
        this.listaAdj[indexVerticeOrigem].push(peso ? { vertice: destino, peso: peso } : destino);
    }

    public removerArco(origem: any, destino: any) {
        if (!this.isOrientado) return this.removerAresta(origem, destino);
        //Busca os indices correspondentes a cada uma das vertices. 
        let indexVerticeOrigem = this.V.findIndex(function (vertice) { return vertice == origem });
        let indexVerticeDestino = this.V.findIndex(function (vertice) { return vertice == destino });
        //Remove o arco da matriz.
        this.matrizAdj[indexVerticeOrigem][indexVerticeDestino] = 0;
        //Busca o indice do vertice a ser removido dentro da lista.
        let verticeOrigemIndex = this.listaAdj[indexVerticeOrigem].findIndex(function (vertice) { return vertice == destino });
        //Remove o arco da lista.
        this.listaAdj[indexVerticeOrigem].splice(verticeOrigemIndex, 1);
    }

    public existeAresta(origem: any, destino: any) {
        //Busca os indices correspondentes a cada uma das vertices.
        let indexVerticeOrigem = this.V.findIndex(function (vertice) { return vertice == origem });
        let indexVerticeDestino = this.V.findIndex(function (vertice) { return vertice == destino });
        return this.matrizAdj[indexVerticeOrigem][indexVerticeDestino];
    }

    public retornarVertice(nome: any) {
        let resultado = false;
        this.V.forEach(function (v) {
            if (nome === v) {
                resultado = v;
                return;
            }
        });
        return resultado;
    }

    public retornarArestas(origem) {
        var index = this.V.findIndex(function (vertice) { return vertice == origem });
        var adjascentes = [];
        for (var i = 0; i < this.V.length; i++)
            if (i !== origem && this.matrizAdj[index][i])
                adjascentes.push(i);
        return adjascentes;
    }

    public dfs(verticeOrigem, verticeDestino = null) {
        var pilha = [];
        var visitados = [];
        var achouDestino = false;
        verificacaoRecursiva(verticeOrigem, this);
        var grafo = this;
        if (!achouDestino)
            this.V.forEach(function (v) {
                if (visitados.indexOf(v) == -1) {
                    verificacaoRecursiva(v, grafo);
                }
            });
        console.log("Pilha: " + pilha);
        var saida = "Saída: " + visitados.join(", ");
        console.log(saida);

        function verificacaoRecursiva(atual, _this) {
            visitados.push(atual);
            pilha.push(atual);
            if (verticeDestino === atual) {
                achouDestino = true;
                pilha.pop();
            } else {
                var vizinhos = _this.retornarArestas(atual);
                vizinhos.forEach(function (v) {
                    var vizinho = _this.V[v];
                    //se o vertice não foi visitado ainda
                    if (visitados.indexOf(vizinho) == -1) {
                        verificacaoRecursiva(vizinho, _this);
                    }
                });
                //quando ja percorreu todos os vizinhos
                pilha.pop();
            }
        }
    }

    public bfs(origem, destino = null) {
        // marcar o atual como visitado
        // vizinhos no atual na lista
        // proximo é o primeiro da lista
        var fila = [];
        var visitados = [];
        var achouDestino = false;
        verificacaoRecursiva(origem, this);
        var saida = "Saída: " + visitados.join(", ");
        console.log(saida);
        function verificacaoRecursiva(atual, _this) {
            visitados.push(atual);
            fila.splice(0, 1);
            if (destino !== atual) {
                var vizinhos = _this.retornarArestas(atual);
                vizinhos.forEach(function (v) {
                    var vizinho = _this.V[v];
                    //se o vertice não foi visitado ainda
                    if (visitados.indexOf(vizinho) == -1 &&
                        fila.indexOf(vizinho) == -1) {
                        fila.push(vizinho);
                    }
                });
                //se tem vertice na fila: o próximo é o primeiro da fila
                if (fila.length) {
                    verificacaoRecursiva(fila[0], _this);
                } else {
                    //o próximo é o primeiro vértice não visitado de todo o grafo
                    _this.V.forEach(function (v) {
                        if (visitados.indexOf(v) == -1) {
                            verificacaoRecursiva(v, _this);
                            return;
                        }
                    });
                }
            }
        }
    }

    private extrairKeys(obj) {
        var keys = [], key;
        for (key in obj) {
            Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
        }
        return keys;
    }

    private extrairMenores(antecessores, destino) {
        var nodes = [],
            u = destino;

        while (u !== undefined) {
            console.log(u);
            nodes.push(u);
            u = antecessores[u];
        }
        console.log(nodes);
        nodes.reverse();
        return nodes;
    }

    private ordenar(a, b) {
        return parseFloat(a) - parseFloat(b);
    }

    private acharCaminho(matriz, inicio, fim, infinity?) {
        infinity = infinity || Infinity;

        var custos = {},
            //define primeiro como aberto
            aberto = { '0': [inicio] },
            antecessores = {},
            keys;

        var addParaAberto = function (custo, vertice) {
            var key = "" + custo;
            if (!aberto[key]) aberto[key] = [];
            aberto[key].push(vertice);
        }

        custos[inicio] = 0;

        while (aberto) {
            if (!(keys = this.extrairKeys(aberto)).length) break;

            keys.sort(this.ordenar);

            var key = keys[0],
                bucket = aberto[key],
                node = bucket.shift(),
                custoAtual = parseFloat(key),
                verticesAdjacentes = matriz[node] || {};

            if (!bucket.length) delete aberto[key];

            for (var vertice in verticesAdjacentes) {

                if (Object.prototype.hasOwnProperty.call(verticesAdjacentes, vertice)) {
                    var custo = verticesAdjacentes[vertice],
                        custoTotal = custo + custoAtual,
                        custoVertice = custos[vertice];

                    if ((custoVertice === undefined) || (custoVertice > custoTotal)) {
                        custos[vertice] = custoTotal;
                        addParaAberto(custoTotal, vertice);
                        antecessores[vertice] = node;
                    }
                }
            }
        }

        if (custos[fim] === undefined) {
            return null;
        } else {
            return antecessores;
        }

    }

    //Transforma a matriz em um objeto com as vertices e as ligações
    public montarMatrizParaDijkstra() {
        let obj = {};
        this.matrizAdj.forEach((arestas, indice) => {
            let vertice = this.V[indice];
            let obj2 = {};
            arestas.forEach((peso, indice2) => {
                let verticeDestino;
                if (peso > 0) {
                    verticeDestino = this.V[indice2];
                    obj2[verticeDestino] = peso;
                }
            });
            obj[vertice] = obj2;
        });
        return obj;
    }

    public dijkstra(origem, destino) {
        var antecessores,
            caminho = [],
            menores;

        //Pega o menor caminho do grafo
        antecessores = this.acharCaminho(this.montarMatrizParaDijkstra(), origem, destino);

        console.log(antecessores);

        if (antecessores) {
            //Pega o menor caminho com base no destino
            menores = this.extrairMenores(antecessores, destino);
            return caminho.concat(menores);
        } else {
            return null;
        }
    }

    public imprimirGrafo() {
        let vertices = this.V;
        let recuo = "    ";
        let espaco = "   ";

        //Imprime a matriz.
        console.log('Matriz de adjacência:');
        console.log(recuo + vertices.join(espaco));
        this.matrizAdj.forEach(function (valor, indice) {
            let linha = vertices[indice] + " | " + valor.join(" | ") + " | ";
            console.log(linha);
        });

        console.log("");

        //Imprime a lista.
        console.log('Lista de adjacência:');
        this.listaAdj.forEach(function (valor, indice) {
            let linha = vertices[indice] + " -> " + valor.map(function (el) {
                return el.peso
                    ? el.vertice + "|" + el.peso
                    : el
            }).join(" | ");
            console.log(linha);
        });
    }
    //calcula o grau de cada vértice e retorna um array ordenado
    public ordenarPorGrau() {
        var retorno = [];
        var _this = this;
        //para cada linha da matriz 
        this.matrizAdj.forEach(function (elemento, index) {
            var v = <any>{};
            v.index = index;
            v.nome = _this.V[index];
            v.grau = 0;
            v.saturacao = 0;
            v.cor = '';
            //para cada coluna, soma o grau em um para cada ligação
            elemento.forEach(function (aresta) {
                if (aresta > 0) {
                    v.grau++;
                }
            });
            //adiciona o objeto (index,grau) na variável de retorno
            retorno.push(v);
        });
        //ordena o array pelo grau
        retorno.sort(function (a, b) {
            return b.grau - a.grau;
        });
        return retorno;
    }

    public welshPowell() {
        var vertices = this.ordenarPorGrau();
        var indexCor = 0;
        var indexVertice = 0;
        let _this = this;

        //enquanto existir vertices sem cor no grafo
        while (existeVerticeSemCor()) {
            //cor atual recebe a proxima cor do array de cores
            var corAtual = this.vetorDeCores[indexCor];
            console.log(corAtual);
            //vertice atual recebe o proximo vertice 
            var verticeAtual = vertices[indexVertice];
            //se o vertice atual ainda não foi colorido
            console.log(verticeAtual.nome + " : " + verticeAtual.cor);
            if (!verticeAtual.cor) {
                //pinta o vertice atual com a cor atual
                verticeAtual.cor = corAtual;
                console.log(verticeAtual.nome + " foi colorido de " + corAtual);
                //para cada vertice, verifica se há uma ligação com o vértice atual
                //os vértices NÃO adjacentes ao vértice atual, podem ser coloridos da mesma cor
                vertices.forEach(function (vertice, index) {
                    if (!vertice.cor) {
                        if (_this.existeAresta(verticeAtual.nome, vertice.nome) === 0) {
                            // para cada vizinho do vertice, verifica se já não existe um adjacente com a mesma cor
                            var vizinhos = _this.retornarArestas(vertice.nome);
                            var existe = false;
                            for (var i = 0; i < vizinhos.length; i++) {
                                var adjacente = vertices.find(function (v) {
                                    return v.index == vizinhos[i];
                                });
                                if (adjacente.cor == corAtual) {
                                    existe = true;
                                    break;
                                }
                            }
                            //se não existe, o vertice é preenchido com a cor atual
                            if (!existe) {
                                vertice.cor = corAtual;
                                console.log(vertice.nome + " foi colorido de " + corAtual);
                            }
                        }
                    }
                });
                indexCor++;
            }
            indexVertice++;
        }


        vertices.forEach(function (vertice) {
            var adjacentes = _this.retornarArestas(vertice.nome);
            var array = [];
            adjacentes.forEach(function (i) {
                array.push(_this.V[i]);
            });
            vertice.vizinhos = array;
        });

        console.log(vertices);

        this.desenhaGrafo(vertices, this.isOrientado);

        function existeVerticeSemCor() {
            var encontrado = false;
            vertices.forEach(function (vertice) {
                if (!vertice.cor) {
                    encontrado = true;
                }
            });
            return encontrado;
        }
    }

    public dSatur() {
        //ordena os vertices pelo grau
        var vertices = this.ordenarPorGrau();
        //sempre começa pelo vertice de maior grau
        var indexVertice = 0;
        //enquanto existir um vertice sem cor
        while (existeVerticeSemCor()) {
            //atribui o vertice atual a variavel
            var verticeAtual = vertices[indexVertice];
            //pega os vizinhos do vertice atual 
            verticeAtual.vizinhos = this.retornarArestas(verticeAtual.nome);
            //sempre começa pela primeira cor
            var indexCor = 0;
            //enquanto o vertice atual não possuir uma cor
            while (!verticeAtual.cor) {
                //variaveis de controle
                var corEncontrada = false;
                var cor = this.vetorDeCores[indexCor];
                //procura um vizinho com a cor que esta sendo aplicada                    
                for (var i = 0; i < verticeAtual.vizinhos.length; i++) {
                    var adjacente = vertices.find(function (v) {
                        return v.index == verticeAtual.vizinhos[i];
                    });

                    if (adjacente.cor === cor) {
                        corEncontrada = true;
                        break;
                    }
                }
                //se a cor foi encontrada, pega a proxima cor e recomeça a busca
                if (corEncontrada) {
                    indexCor++;
                    //se não, o vértice atual recebe a cor atual e sai do laço
                } else {
                    verticeAtual.cor = cor;
                }
            }

            //incrementa em 1 a saturacao de todos os vizinhos do vertice atual
            for (var i = 0; i < verticeAtual.vizinhos.length; i++) {
                var adjacente: any = vertices.findIndex(function (v) {
                    return v.index == verticeAtual.vizinhos[i];
                });
                vertices[adjacente].saturacao++;
            }


            vertices[indexVertice] = verticeAtual;

            //decide quem sera o proximo vertice
            var maiorSaturacao = 0;
            var indexMaiorSaturacao = 0;
            //o proximo vertice será o com maior saturacao
            //no caso de empate, será o com maior grau dentre os de maior saturacao
            for (var i = 0; i < vertices.length; i++) {
                if (!vertices[i].cor) {
                    if (vertices[i].saturacao > maiorSaturacao) {
                        maiorSaturacao = vertices[i].saturacao;
                        indexMaiorSaturacao = i;
                    } else if (vertices[i].saturacao == maiorSaturacao) {
                        if (vertices[i].grau > vertices[indexMaiorSaturacao]) {
                            maiorSaturacao = vertices[i].saturacao;
                            indexMaiorSaturacao = i;
                        }
                    }
                }
            }
            indexVertice = indexMaiorSaturacao;
        }

        var _this = this;
        vertices.forEach(function (vertice) {
            var adjacentes = _this.retornarArestas(vertice.nome);
            var array = [];
            adjacentes.forEach(function (i) {
                array.push(_this.V[i]);
            });
            vertice.vizinhos = array;
        });

        console.log(vertices);

        this.desenhaGrafo(vertices, this.isOrientado);

        function existeVerticeSemCor() {
            var encontrado = false;
            vertices.forEach(function (vertice) {
                if (!vertice.cor) {
                    encontrado = true;
                }
            });
            return encontrado;
        }
    }

    // //Prepara estrutura de dados para o algoritmo de dijkstra.
    // private preparaEstruturaDijkstra(n) {
    //     let vertices = [];
    //     for (var i = 0; i < n; i++)
    //         vertices.push({
    //             aberto: true,
    //             anterior: null,
    //             distancia: Infinity,
    //             posicao: i
    //         });
    //     return vertices;
    // }

    // private caminharAteComeco(vertices, atual, caminho = []) {
    //     caminho.push(atual);
    //     if (vertices[atual].distancia)
    //         return this.caminharAteComeco(vertices, vertices[atual].anterior, caminho);
    //     return caminho;
    // }

    // public dijkstra(atual, destino) {
    //     let vertices = this.preparaEstruturaDijkstra(this.matrizAdj.length);
    //     let indexAtual = this.V.findIndex(function (vertice) { return vertice == atual });
    //     vertices[indexAtual].distancia = 0;
    //     do {
    //         if (atual === destino)
    //             return this.caminharAteComeco(vertices, indexAtual);
    //         // atribuir distancia aos vizinhos
    //         var vizinhos = this.retornarArestas(atual);
    //         for (var i = 0; i < vizinhos.length; i++) {
    //             var v = vizinhos[i];
    //             var caminhada = vertices[indexAtual].distancia + this.matrizAdj[indexAtual][v];
    //             if (caminhada < vertices[v].distancia) {
    //                 vertices[v].distancia = caminhada;
    //                 vertices[v].anterior = indexAtual;
    //             }
    //         }
    //         // definir proximo vertice aberto finito com menor distancia
    //         vertices[indexAtual].aberto = false;
    //         var menorDistancia = Infinity;
    //         var existeVerticeAbertoFinito = false;
    //         for (var i = 0; i < vertices.length; i++) {
    //             if (vertices[i].aberto && vertices[i].distancia < Infinity) {
    //                 existeVerticeAbertoFinito = true;
    //                 if (vertices[i].distancia < menorDistancia) {
    //                     indexAtual = i;
    //                 }
    //             }
    //         }
    //     } while (existeVerticeAbertoFinito);
    //     return vertices;
    // }


    public desenhaGrafo(grafo, isOriented) {
        var graphGenerator = Viva.Graph.generator();
        var graph = Viva.Graph.graph();


        grafo.forEach(function (vertice) {
            graph.addNode(vertice.nome, vertice.cor);
        });

        grafo.forEach(function (vertice) {
            var label = vertice.nome;

            vertice.vizinhos.forEach(function (vizinho) {
                graph.addLink(label, vizinho);
            });
        });


        var layout = Viva.Graph.Layout.forceDirected(graph, {
            springLength: 20,
            springCoeff: 0.0002,
            dragCoeff: 0.08,
            gravity: -1.2,
        });

        var createMarker = function (id) {
            return Viva.Graph.svg('marker')
                .attr('id', id)
                .attr('viewBox', "0 0 10 10")
                .attr('refX', "10")
                .attr('refY', "5")
                .attr('markerUnits', "strokeWidth")
                .attr('markerWidth', "10")
                .attr('markerHeight', "5")
                .attr('orient', "auto")
                .attr('fill', "#999999");
        }

        function customGraphics() {

            var graphics = Viva.Graph.View.svgGraphics();


            graphics.node(function (node) {
                if (!node.data) {
                    node.data = '#88e2c6';
                }

                var ui = Viva.Graph.svg('g'),
                    svgText = Viva.Graph.svg('text').attr('y', '-4px').attr("font-size", 8).attr("font-family", "Arial").text(node.id),
                    rect = Viva.Graph.svg("rect")
                        .attr("width", 10)
                        .attr("height", 10)
                        .attr("rx", 100)
                        .attr("ry", 100)
                        .attr("stroke", "black")
                        .attr("stroke-width", 0.4)
                        .attr("fill", node.data);

                ui.append(svgText);
                ui.append(rect);

                return ui;
            }).placeNode(function (nodeUI, pos) {
                nodeUI.attr('transform',
                    'translate(' +
                    (pos.x - 10 / 2) + ',' + (pos.y - 10 / 2) +
                    ')');
            });

            if (isOriented) {
                var geom = Viva.Graph.geom();

                graphics.link(function (link) {
                    var ui = Viva.Graph.svg('path');
                    ui.attr('stroke', 'gray')
                        .attr('marker-end', 'url(#Triangle)');
                    return ui;

                }).placeLink(function (linkUI, fromPos, toPos) {
                    // Here we should take care about
                    //  "Links should start/stop at node's bounding box, not at the node center."

                    // For rectangular nodes Viva.Graph.geom() provides efficient way to find
                    // an intersection point between segment and rectangle
                    var toNodeSize = 10,
                        fromNodeSize = 10;

                    let marker = createMarker('Triangle');
                    marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

                    // Marker should be defined only once in <defs> child element of root <svg> element:
                    var defs = graphics.getSvgRoot().append('defs');
                    defs.append(marker);

                    var from = geom.intersectRect(
                        // rectangle:
                        fromPos.x - fromNodeSize / 3, // left	
                        fromPos.y - fromNodeSize / 3, // top
                        fromPos.x + fromNodeSize / 3, // right
                        fromPos.y + fromNodeSize / 3, // bottom
                        // segment:
                        fromPos.x, fromPos.y, toPos.x, toPos.y)
                        || fromPos; // if no intersection found - return center of the node

                    var to = geom.intersectRect(
                        // rectangle:
                        toPos.x - toNodeSize / 2.4, // left
                        toPos.y - toNodeSize / 2.5, // top
                        toPos.x + toNodeSize / 2.5, // right
                        toPos.y + toNodeSize / 2.5, // bottom
                        // segment:
                        toPos.x, toPos.y, fromPos.x, fromPos.y)
                        || toPos; // if no intersection found - return center of the node

                    var data = 'M' + from.x + ',' + from.y +
                        'L' + to.x + ',' + to.y;

                    linkUI.attr("d", data);
                });
            }

            return graphics;
        }

        var renderer = Viva.Graph.View.renderer(graph, {
            layout: layout,
            graphics: customGraphics(),
            container: document.getElementById('graphContainer')
        });

        renderer.run();

        for (var i = 0; i < 16; i++) {
            renderer.zoomIn();
        }
    }

    private TemCicloTres() {
        var _this = this;
        var tem = false;
        //para cada vertice i do grafo
        this.matrizAdj.forEach(function (element, i) {
            var verticeAtual = <any>{};
            verticeAtual.index = i;
            verticeAtual.nome = _this.V[i];
            verticeAtual.vizinhos = _this.retornarArestas(verticeAtual.nome);
            console.log('vertice atual:');
            console.log(verticeAtual);
            //para cada vizinho j do vertice i
            verticeAtual.vizinhos.forEach(function (j) {
                var nome = _this.V[j];
                var vizinhos = _this.retornarArestas(nome);
                console.log("vizinhos do vizinho");
                console.log(vizinhos);
                //para cada vizinho k do vertice j
                vizinhos.forEach(function (k) {
                    var nome = _this.V[k];
                    console.log('vizinho:' + nome); 
                    //se k eh vizinho de i
                    var aresta = _this.existeAresta(nome, verticeAtual.nome);
                    if (aresta > 0) {
                        tem = true;
                    }
                });

            });
            console.log('--------------------------------');
        });
        console.log("cicloTres: " + tem);
        return tem;
    }

    private QuantidadeDeArestas() {
        var qtdArestas = 0;
        var _this = this;
        var visitados = [];

        this.matrizAdj.forEach(function (element, i) {
            var verticeAtual = <any>{};
            verticeAtual.index = i;
            verticeAtual.nome = _this.V[i];
            verticeAtual.vizinhos = _this.retornarArestas(verticeAtual.nome);


            verticeAtual.vizinhos.forEach(function (element) {
                var vertice = _this.V[element];
                if (visitados.indexOf(vertice) > -1) {
                    qtdArestas++;
                }
            });
            visitados.push(verticeAtual.nome);
        });
        return qtdArestas;
    }

    public VerificarPlanaridade() {
        var qtdVertices = this.matrizAdj.length;
        var qtdArestas = this.QuantidadeDeArestas();
        console.log("Qtd: " + qtdArestas);
        if (qtdVertices <= 0){
            return "Não existe elementos no grafo";
        }
        if (qtdVertices <= 2) {
            return "É planar";
        } else if (this.TemCicloTres()) {
            if (qtdVertices >= 3 && qtdArestas <= 3 * qtdVertices - 6) {
                return "Pode ser planar";
            }
        } else {
            if (qtdVertices >= 3 && qtdArestas <= 2 * qtdVertices - 4) {
                return "Pode ser planar";
            }
        }
        return "Não é planar";
    }

    public AplicaPrim(){
        var pai = [];
    }
}