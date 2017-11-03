import { Component } from '@angular/core';
import { Grafo } from './grafo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private grafo: Grafo = new Grafo();
  public verticeNome: string;
  public tipo: string = 'aresta';
  public origem: string;
  public destino: string;
  public dijkstraOrigem: string;
  public dijkstraDestino: string;
  public peso: string;
  public metodoParaColorir: string = '2';
  public primOrigem: string;

  constructor() {
    //1
    this.grafo.inserirVertice('A');
    this.grafo.inserirVertice('B');
    this.grafo.inserirVertice('C');
    this.grafo.inserirVertice('D');
    this.grafo.inserirVertice('E');
    this.grafo.inserirVertice('F');

    this.grafo.inserirAresta('A', 'D', 2);
    this.grafo.inserirAresta('A', 'E', 10);
    this.grafo.inserirAresta('A', 'C', 7);
    this.grafo.inserirAresta('F','E', 8);
    this.grafo.inserirAresta('F', 'D', 4);
    this.grafo.inserirAresta('F', 'C', 3);
    this.grafo.inserirAresta('F', 'B', 2);
    this.grafo.inserirAresta('C', 'B', 3);
    this.grafo.inserirAresta('E', 'C', 9);
    this.grafo.inserirAresta('E', 'D', 7);

    //2

    // this.grafo.inserirVertice('0');
    // this.grafo.inserirVertice('1');
    // this.grafo.inserirVertice('2');
    // this.grafo.inserirVertice('3');
    // this.grafo.inserirVertice('4');


    // this.grafo.inserirAresta('0', '1', 1);
    // this.grafo.inserirAresta('0', '2', 1);
    // this.grafo.inserirAresta('0', '3', 1);
    // this.grafo.inserirAresta('0', '4', 1);

    // this.grafo.inserirAresta('1', '2', 1);
    // this.grafo.inserirAresta('1', '3', 1);
    // this.grafo.inserirAresta('1', '4', 1);

    // this.grafo.inserirAresta('2', '4', 1);

    // this.grafo.inserirAresta('3', '4', 1);

    // this.grafo.inserirAresta('2', '3', 1);

    //3

    // this.grafo.inserirVertice('0');
    // this.grafo.inserirVertice('1');
    // this.grafo.inserirVertice('2');
    // this.grafo.inserirVertice('3');
    // this.grafo.inserirVertice('4');

    // this.grafo.inserirAresta('0', '3', 1);
    // this.grafo.inserirAresta('0', '2', 1);

    // this.grafo.inserirAresta('1', '2', 1);
    // this.grafo.inserirAresta('1', '4', 1);

    // this.grafo.inserirAresta('3', '4', 1);



    //4
    // this.grafo.inserirVertice('0');
    // this.grafo.inserirVertice('1');
    // this.grafo.inserirVertice('2');
    // this.grafo.inserirVertice('3');
    // this.grafo.inserirVertice('4');
    // this.grafo.inserirVertice('5');

    // this.grafo.inserirAresta('0', '1', 1);
    // this.grafo.inserirAresta('0', '2', 5);
    // this.grafo.inserirAresta('1', '4', 6);
    // this.grafo.inserirAresta('1', '3', 4);
    // this.grafo.inserirAresta('4', '2', 1);

    // this.grafo.inserirAresta('4', '5', 7);
    // this.grafo.inserirAresta('2', '5', 2);
    // this.grafo.inserirAresta('5', '3', 15);

    // this.grafo.dSatur();
  }

  public inserirVertice() {
    if (this.verticeNome) {
      this.grafo.inserirVertice(this.verticeNome.toUpperCase());
      this.verticeNome = "";
    }
  }

  public removerVertice() {
    if (this.verticeNome) {
      this.grafo.removerVertice(this.verticeNome.toUpperCase());
      this.verticeNome = "";
    }
  }

  public inserir() {
    if (this.tipo == 'aresta') {
      this.grafo.inserirAresta(this.origem.toUpperCase(), this.destino.toUpperCase(), 1);
    } else if (this.tipo == 'arco') {
      this.grafo.inserirArco(this.origem.toUpperCase(), this.destino.toUpperCase(), parseInt(this.peso));
    }
    this.grafo.imprimirGrafo();
  }

  public remover() {
    if (this.tipo == 'aresta') {
      this.grafo.removerAresta(this.origem.toUpperCase(), this.destino.toUpperCase());
    } else if (this.tipo == 'arco') {
      this.grafo.removerArco(this.origem.toUpperCase(), this.destino.toUpperCase());
    }
    this.grafo.imprimirGrafo();
  }

  public colorir() {
    this.removerSvg();
    if (this.metodoParaColorir == '1') {
      this.grafo.dSatur();
    } else if (this.metodoParaColorir == '2') {
      this.grafo.welshPowell();
    }
  }

  public dijkstra() {
    let resultado = this.grafo.dijkstra(this.dijkstraOrigem.toUpperCase(), this.dijkstraDestino.toUpperCase());
    alert('O menor caminho é: ' + resultado.join(', '));
  }

  public verificarPlanaridade() {
    alert(this.grafo.VerificarPlanaridade());
  }

  private removerSvg() {
    let container = document.getElementById('graphContainer');
    let svg = container.getElementsByTagName('svg').item(0);
    if (svg)
      svg.remove();
  }

  public aplicaPrim() {
    this.removerSvg();
    let resultado = this.grafo.AplicaPrim(this.primOrigem.toUpperCase());
  }

  public kruskal() {
    this.removerSvg();
    let result = this.grafo.kruskal();
    let arrayzao = [];

    result.forEach(value => {
      if (arrayzao.findIndex(x => x.nome == value.origem) < 0) {
        arrayzao.push({ nome: value.origem, vizinhos: [] });
      }
    });

    arrayzao.forEach(value => {
      var arr = result.filter(x => x.origem == value.nome);
      if (arr.length > 0)
        arr.forEach(element => {
          value.vizinhos.push(element.destino);
        });
    });

    console.log(arrayzao);
    this.grafo.desenhaGrafo(arrayzao, false);
  }
}
