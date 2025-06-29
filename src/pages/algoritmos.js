// src/data/algoritmos.js

export const algoritmos = [
  {
    titulo: "Algoritmo del Avestruz",
    descripcion: "El algoritmo del avestruz ignora un problema potencial bajo la suposición de que es muy poco probable que ocurra, y que afrontarlo sería más costoso (en tiempo, complejidad o rendimiento) que simplemente no hacer nada. Este ejemplo simula un caso en el que dos hilos incrementan una variable compartida sin usar mecanismos de sincronización como mutex. Representa una estrategia de ignorar deliberadamente los errores por condiciones de carrera cuando se consideran poco probables o de bajo impacto. Ideal para observar resultados inconsistentes al manipular recursos compartidos.",
    codigo: `#include <iostream>
  #include <thread>
  
  int counter = 0; // recurso compartido
  
  void incrementar() {
      for (int i = 0; i < 1000000; ++i) {
          counter++; // sin sincronización
      }
  }
  
  int main() {
      std::thread t1(incrementar);
      std::thread t2(incrementar);
  
      t1.join();
      t2.join();
  
      std::cout << "Valor final del contador: " << counter << std::endl;
      return 0;
  }`,
    ejecutar: () => {
      const base = 1000000;
      const resultado = Math.floor(base + Math.random() * base); // Simula pérdida por condición de carrera
      alert("Simulación (sin sincronización): Valor final del contador ≈ " + resultado);
    }
  },   
  {
    titulo: "Algoritmo del Banquero (1 Recurso)",
    descripcion: "El algoritmo del banquero es una técnica de planificación de recursos que evita caer en estados de interbloqueo (deadlock). Funciona como si el sistema fuera un banquero que solo concede préstamos (recursos) si puede garantizar que podrá satisfacer las necesidades futuras de todos los clientes (procesos).",
    codigo: `#include <iostream>
  using namespace std;
  
  int main() {
      const int TOTAL_RECURSOS = 10;
      int max[3] = {7, 5, 3};        // Máximo que cada proceso puede pedir
      int asignado[3] = {0, 2, 2};   // Lo que ya tienen asignado
      int necesidad[3];             // Lo que aún podrían pedir
      int disponibles = TOTAL_RECURSOS - (asignado[0] + asignado[1] + asignado[2]);
  
      for (int i = 0; i < 3; ++i) {
          necesidad[i] = max[i] - asignado[i];
      }
  
      int solicitud = 2;
      int proceso = 0;
  
      cout << "Proceso " << proceso << " solicita " << solicitud << " unidades\\n";
  
      if (solicitud <= necesidad[proceso] && solicitud <= disponibles) {
          disponibles -= solicitud;
          asignado[proceso] += solicitud;
          necesidad[proceso] -= solicitud;
  
          bool puedeTerminar[3] = {false, false, false};
          int disponiblesTemporales = disponibles;
  
          for (int i = 0; i < 3; ++i) {
              if (necesidad[i] <= disponiblesTemporales) {
                  disponiblesTemporales += asignado[i];
                  puedeTerminar[i] = true;
              }
          }
  
          if (puedeTerminar[0] && puedeTerminar[1] && puedeTerminar[2]) {
              cout << "Solicitud concedida. Estado seguro.\\n";
          } else {
              disponibles += solicitud;
              asignado[proceso] -= solicitud;
              necesidad[proceso] += solicitud;
              cout << "Solicitud rechazada. Estado inseguro.\\n";
          }
      } else {
          cout << "Solicitud inválida o no hay recursos suficientes.\\n";
      }
  
      return 0;
  }`,
    ejecutar: () => {
      const total = 10;
      const asignado = [0, 2, 2];
      const max = [7, 5, 3];
      const necesidad = max.map((m, i) => m - asignado[i]);
      let disponibles = total - asignado.reduce((a, b) => a + b, 0);
  
      const solicitud = 2;
      const proceso = 0;
  
      if (solicitud <= necesidad[proceso] && solicitud <= disponibles) {
        disponibles -= solicitud;
        asignado[proceso] += solicitud;
        necesidad[proceso] -= solicitud;
  
        let puedeTerminar = [false, false, false];
        let disponiblesTemp = disponibles;
  
        for (let i = 0; i < 3; ++i) {
          if (necesidad[i] <= disponiblesTemp) {
            disponiblesTemp += asignado[i];
            puedeTerminar[i] = true;
          }
        }
  
        if (puedeTerminar[0] && puedeTerminar[1] && puedeTerminar[2]) {
          alert("Solicitud concedida. Estado seguro.");
        } else {
          alert("Solicitud rechazada. Estado inseguro.");
        }
      } else {
        alert("Solicitud inválida o no hay recursos suficientes.");
      }
    }
  },  
  {
    titulo: "Algoritmo del Banquero (Varios Recursos)",
    descripcion: "Gestiona múltiples procesos y recursos para evitar el interbloqueo con múltiples tipos de recursos. Este ejemplo evalúa si una solicitud puede ser concedida sin llevar al sistema a un estado inseguro.",
    codigo: `#include <iostream>
  using namespace std;
  
  int main() {
      const int P = 2, R = 2;
      int disponibles[R] = {3, 2}; // Recursos disponibles
  
      int max[P][R] = {{4, 2}, {2, 2}};
      int asignado[P][R] = {{2, 0}, {1, 1}};
      int solicitud[R] = {1, 1}; // Proceso 0 pide 1 de A y 1 de B
  
      int necesidad[P][R];
      for (int i = 0; i < P; i++)
          for (int j = 0; j < R; j++)
              necesidad[i][j] = max[i][j] - asignado[i][j];
  
      for (int j = 0; j < R; j++) {
          if (solicitud[j] > necesidad[0][j] || solicitud[j] > disponibles[j]) {
              cout << "Solicitud no válida o recursos insuficientes.\\n";
              return 0;
          }
      }
  
      for (int j = 0; j < R; j++) {
          disponibles[j] -= solicitud[j];
          asignado[0][j] += solicitud[j];
          necesidad[0][j] -= solicitud[j];
      }
  
      bool puedeTerminar[P] = {false};
      for (int i = 0; i < P; i++) {
          bool ok = true;
          for (int j = 0; j < R; j++) {
              if (necesidad[i][j] > disponibles[j]) {
                  ok = false;
                  break;
              }
          }
          puedeTerminar[i] = ok;
      }
  
      if (puedeTerminar[0] || puedeTerminar[1])
          cout << "Solicitud concedida. Estado seguro.\\n";
      else
          cout << "Solicitud rechazada. Estado inseguro.\\n";
  
      return 0;
  }`,
    ejecutar: () => {
      const P = 2, R = 2;
      let disponibles = [3, 2];
      const max = [[4, 2], [2, 2]];
      const asignado = [[2, 0], [1, 1]];
      const solicitud = [1, 1]; // Proceso 0
  
      const necesidad = [];
      for (let i = 0; i < P; i++) {
        necesidad[i] = [];
        for (let j = 0; j < R; j++) {
          necesidad[i][j] = max[i][j] - asignado[i][j];
        }
      }
  
      // Verificación inicial
      for (let j = 0; j < R; j++) {
        if (solicitud[j] > necesidad[0][j] || solicitud[j] > disponibles[j]) {
          alert("Solicitud no válida o recursos insuficientes.");
          return;
        }
      }
  
      // Simular asignación
      for (let j = 0; j < R; j++) {
        disponibles[j] -= solicitud[j];
        asignado[0][j] += solicitud[j];
        necesidad[0][j] -= solicitud[j];
      }
  
      // Verificar si algún proceso puede terminar
      let puedeTerminar = [false, false];
      for (let i = 0; i < P; i++) {
        let ok = true;
        for (let j = 0; j < R; j++) {
          if (necesidad[i][j] > disponibles[j]) {
            ok = false;
            break;
          }
        }
        puedeTerminar[i] = ok;
      }
  
      if (puedeTerminar[0] || puedeTerminar[1]) {
        alert("Solicitud concedida. Estado seguro.");
      } else {
        alert("Solicitud rechazada. Estado inseguro.");
      }
    }
  },  

  {
    titulo: "Problema de los Filósofos",
    descripcion: "Simula una solución al problema de los filósofos utilizando múltiples hilos y mutex para evitar condiciones de carrera. Se emplea una estrategia de asimetría en la toma de tenedores para evitar el interbloqueo (deadlock). Ahora incluye aleatoriedad en el número de ciclos y el orden de ejecución.",
    codigo: `#include <iostream>
#include <thread>
#include <mutex>
#include <chrono>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

const int N = 5;
mutex tenedores[N];

random_device rd;
mt19937 gen(rd());
uniform_int_distribution<> rondasDist(1, 3);
uniform_real_distribution<> probEsperar(0.0, 1.0);

void filosofo(int id) {
    int izq = id;
    int der = (id + 1) % N;

    int rondas = rondasDist(gen);

    for (int r = 1; r <= rondas; ++r) {
        cout << "🤔 Filósofo " << id << " piensa (ronda " << r << ")\n";
        this_thread::sleep_for(chrono::milliseconds(200));

        if (probEsperar(gen) < 0.3) {
            cout << "⏳ Filósofo " << id << " espera tenedores\n";
            this_thread::sleep_for(chrono::milliseconds(100));
        }

        if (id % 2 == 0) {
            tenedores[izq].lock();
            tenedores[der].lock();
        } else {
            tenedores[der].lock();
            tenedores[izq].lock();
        }

        cout << "🍝 Filósofo " << id << " come (ronda " << r << ")\n";
        this_thread::sleep_for(chrono::milliseconds(200));

        tenedores[izq].unlock();
        tenedores[der].unlock();

        cout << "🍽️ Filósofo " << id << " suelta tenedores (ronda " << r << ")\n";
    }

    cout << "✅ Filósofo " << id << " ha terminado tras " << rondas << " ronda" << (rondas > 1 ? "s" : "") << "\n";
}

int main() {
    vector<int> orden(N);
    for (int i = 0; i < N; ++i) orden[i] = i;
    shuffle(orden.begin(), orden.end(), gen);

    vector<thread> filosofos;
    for (int id : orden) {
        filosofos.emplace_back(filosofo, id);
    }

    for (auto& t : filosofos) {
        t.join();
    }

    cout << "🎉 Todos los filósofos han terminado.\n";
    return 0;
}
`,
    ejecutar: () => {
      const N = 5;
      const salida = [];
      const orden = Array.from({ length: N }, (_, i) => i).sort(() => Math.random() - 0.5);
    
      orden.forEach(id => {
        const rondas = Math.floor(Math.random() * 3) + 1;
        for (let r = 1; r <= rondas; r++) {
          salida.push(`🤔 Filósofo ${id} piensa (ronda ${r})`);
          if (Math.random() < 0.3) {
            salida.push(`⏳ Filósofo ${id} espera tenedores`);
          }
          salida.push(`🍝 Filósofo ${id} come (ronda ${r})`);
          salida.push(`🍽️ Filósofo ${id} suelta tenedores (ronda ${r})`);
        }
        salida.push(`✅ Filósofo ${id} ha terminado tras ${rondas} ronda${rondas > 1 ? 's' : ''}`);
      });
    
      salida.push("🎉 Todos los filósofos han terminado.");
      alert(salida.join("\n"));
    }
    
  },  

  {
    titulo: "Lectores-Escritores",
    descripcion: "Simula el acceso concurrente de múltiples lectores y escritores a un recurso compartido. Los lectores pueden acceder simultáneamente, mientras que los escritores requieren acceso exclusivo. Esta solución evita condiciones de carrera mediante control de acceso sincronizado.",
    codigo: `#include <iostream>
  #include <thread>
  #include <mutex>
  #include <chrono>
  #include <vector>
  using namespace std;
  
  mutex recurso;
  mutex mtx_lectores;
  int lectores_activos = 0;
  
  void lector(int id) {
      mtx_lectores.lock();
      lectores_activos++;
      if (lectores_activos == 1) {
          recurso.lock();
      }
      mtx_lectores.unlock();
  
      cout << "📖 Lector " << id << " está leyendo..." << endl;
      this_thread::sleep_for(chrono::milliseconds(500));
  
      mtx_lectores.lock();
      lectores_activos--;
      if (lectores_activos == 0) {
          cout << "📚 Todos los lectores terminaron de leer" << endl;
          recurso.unlock();
      }
      mtx_lectores.unlock();
  }
  
  void escritor(int id) {
    double chance = probabilidad(generator);
    if (recurso.try_lock()) {
        cout << "✍️ Escritor " << id << " está escribiendo..." << endl;
        this_thread::sleep_for(chrono::milliseconds(500));
        recurso.unlock();
    } else {
        cout << "❌ Escritor " << id << " espera" << endl;
    }
}
  int main() {
      const int ciclos = 3;
      const int num_lectores = 3;
      const int num_escritores = 2;
  
      for (int ciclo = 1; ciclo <= ciclos; ++ciclo) {
          cout << "🔁 Ciclo " << ciclo << endl;
  
          vector<thread> hilos;
  
          // Lectores
          for (int i = 0; i < num_lectores; ++i) {
              hilos.push_back(thread(lector, i + 1));
          }
          for (auto& h : hilos) h.join();
          hilos.clear();
  
          // Escritores
          for (int i = 0; i < num_escritores; ++i) {
              hilos.push_back(thread(escritor, i + 1));
          }
          for (auto& h : hilos) h.join();
  
          cout << "------------------------------" << endl;
      }
  
      return 0;
  }`,
    ejecutar: () => {
      let lectoresActivos = 0;
      let recursoLibre = true;
      let salida = [];
  
      const lectores = [1, 2, 3];
      const escritores = [1, 2];
  
      for (let ciclo = 1; ciclo <= 3; ciclo++) {
        salida.push(`🔁 Ciclo ${ciclo}`);
        let ordenLectores = [...lectores].sort(() => Math.random() - 0.5);
        ordenLectores.forEach((i) => {
          if (Math.random() < 0.8 && recursoLibre) {
            lectoresActivos++;
            salida.push(`📖 Lector ${i} está leyendo...`);
          }
        });
  
        if (lectoresActivos > 0) {
          recursoLibre = false;
          salida.push(`📚 Todos los lectores terminaron de leer`);
          lectoresActivos = 0;
          recursoLibre = true;
        }
  
        let ordenEscritores = [...escritores].sort(() => Math.random() - 0.5);
        ordenEscritores.forEach((i) => {
          if (recursoLibre && Math.random() < 0.7) {
            recursoLibre = false;
            salida.push(`✍️ Escritor ${i} está escribiendo...`);
            recursoLibre = true;
          } else {
            salida.push(`❌ Escritor ${i} espera`);
          }
        });
  
        salida.push("------------------------------");
      }
  
      alert("📚 Simulación Lectores-Escritores:\n\n" + salida.join("\n"));
    }
  },  
  {
    titulo: "Barbero Durmiente",
    descripcion: "Simula una barbería donde el barbero duerme si no hay clientes y despierta cuando uno llega. Los clientes llegan de forma escalonada. Si hay espacio en la sala de espera (máx. 3 sillas), se sientan; si no, se van. La simulación evita condiciones de carrera y modela la sincronización entre múltiples hilos.",
    codigo: `#include <iostream>
  #include <thread>
  #include <mutex>
  #include <condition_variable>
  #include <queue>
  #include <chrono>
  using namespace std;
  
  const int NUM_SILLAS = 3;
  mutex mtx;
  condition_variable cliente_llega;
  bool barbero_durmiente = true;
  queue<int> sala_espera;
  
  void barbero() {
      while (true) {
          unique_lock<mutex> lock(mtx);
          while (sala_espera.empty()) {
              cout << "💤 Barbero duerme...\\n";
              barbero_durmiente = true;
              cliente_llega.wait(lock);
          }
  
          int cliente_id = sala_espera.front();
          sala_espera.pop();
          cout << "💈 Barbero atiende al cliente " << cliente_id << "\\n";
          lock.unlock();
  
          this_thread::sleep_for(chrono::seconds(2));
          cout << "✅ Cliente " << cliente_id << " ha sido atendido\\n";
      }
  }
  
  void cliente(int id) {
      this_thread::sleep_for(chrono::milliseconds(500 * id));
      unique_lock<mutex> lock(mtx);
      if (sala_espera.size() < NUM_SILLAS) {
          sala_espera.push(id);
          cout << "🪑 Cliente " << id << " se sienta a esperar\\n";
          if (barbero_durmiente) {
              barbero_durmiente = false;
              cliente_llega.notify_one();
          }
      } else {
          cout << "🚪 Cliente " << id << " se va (no hay sillas)\\n";
      }
  }
  
  int main() {
      thread hilo_barbero(barbero);
      thread clientes[10];
      for (int i = 0; i < 10; ++i) {
          clientes[i] = thread(cliente, i + 1);
      }
      for (int i = 0; i < 10; ++i) {
          clientes[i].join();
      }
      hilo_barbero.join();
      return 0;
  }`,
  ejecutar: () => {
    const NUM_SILLAS = 3;
    const TIEMPO_CORTE = 2; // tiempo que tarda el barbero en cortar (en ticks)
    const totalClientes = 10;
  
    let tiempo = 0;
    let salaEspera = [];
    let barberoOcupado = false;
    let tiempoRestante = 0;
    let barberoDurmiendo = true;
    const salida = [];
  
    let llegadas = Array.from({ length: totalClientes }, (_, i) => ({
      id: i + 1,
      tiempoLlegada: Math.floor(Math.random() * 5)
    // llegan cada 0.5 ticks
    }));
  
    while (llegadas.length > 0 || salaEspera.length > 0 || barberoOcupado) {
      // Llegadas en este tiempo
      while (llegadas.length > 0 && llegadas[0].tiempoLlegada <= tiempo) {
        const cliente = llegadas.shift();
        if (salaEspera.length < NUM_SILLAS) {
          salaEspera.push(cliente.id);
          salida.push(`🪑 Cliente ${cliente.id} se sienta a esperar`);
          if (barberoDurmiendo) {
            salida.push(`🔔 Cliente ${cliente.id} despierta al barbero`);
            barberoDurmiendo = false;
          }
        } else {
          salida.push(`🚪 Cliente ${cliente.id} se va (no hay sillas disponibles)`);
        }
      }
  
      // Si el barbero no está ocupado y hay clientes
      if (!barberoOcupado && salaEspera.length > 0) {
        const clienteId = salaEspera.shift();
        salida.push(`💈 Barbero atiende al cliente ${clienteId}`);
        barberoOcupado = true;
        tiempoRestante = TIEMPO_CORTE;
      }
  
      // Si el barbero está ocupado, avanzar el corte
      if (barberoOcupado) {
        tiempoRestante -= 1;
        if (tiempoRestante <= 0) {
          salida.push(`✅ Cliente atendido`);
          barberoOcupado = false;
        }
      }
  
      // Si no hay clientes y no está ocupado, duerme
      if (!barberoOcupado && salaEspera.length === 0 && llegadas.length > 0) {
        salida.push(`💤 Barbero duerme...`);
        barberoDurmiendo = true;
      }
  
      tiempo += 1;
    }
  
    alert("Simulación Barbero Durmiente:\n\n" + salida.join("\n"));
  }
  }  
  ];
  