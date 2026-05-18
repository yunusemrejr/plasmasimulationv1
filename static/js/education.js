// Bilingual Educational Pop-up System for PlasmaSim
// Progressive learning path: from zero knowledge → full understanding of every visible metric & concept

const educationContent = {
  en: {
    title: "Understanding the Fusion Simulation",
    subtitle: "A gentle journey from \"I know nothing\" to \"I understand what every number and color means\"",
    sections: [
      {
        title: "1. What are we actually looking at?",
        body: `<p>You are inside a <strong>virtual fusion reactor</strong>. Tiny electrically charged particles (atomic nuclei) are flying around at extreme speeds. When two special ones get close enough with enough energy, they <strong>merge</strong> and release energy.</p>
                 <p class="theory">(Theoretical: This is a simplified classical + probabilistic model of deuterium-tritium (D-T) nuclear fusion — the easiest fusion reaction that future power plants hope to use.)</p>`
      },
      {
        title: "2. The two kinds of fuel (the colored particles)",
        body: `<p><strong>Cyan (light blue) particles = Deuterium (D)</strong><br>
                 A \"heavy\" version of hydrogen: 1 proton + 1 neutron in the nucleus.</p>
                 <p><strong>Green particles = Tritium (T)</strong><br>
                 An even heavier version: 1 proton + 2 neutrons.</p>
                 <p class="theory">(These are isotopes of hydrogen. Because they are light, the repulsive electric force between them is weaker than for heavier atoms, making fusion easier to achieve.)</p>`
      },
      {
        title: "3. The actual fusion reaction",
        body: `<p>When a Deuterium and a Tritium smash together hard enough they become:</p>
                 <p style="text-align:center; font-size:15px; margin:10px 0;">
                   <strong>D + T  →  Helium-4 + neutron + 17.59 MeV</strong>
                 </p>
                 <p>One helium nucleus (the \"ash\"), one fast neutron, and a burst of energy.</p>
                 <p class="theory">(The 17.59 MeV is the energy released because a tiny bit of mass is converted into energy — exactly what Einstein’s E=mc² predicts. This is the famous Q-value of the D-T reaction.)</p>`
      },
      {
        title: "4. Why fusion is so difficult — The Coulomb Barrier",
        body: `<p>All nuclei have positive charge, so they <strong>repel</strong> each other violently. In the simulation you can clearly see particles bouncing away before they touch.</p>
                 <p>The simulation still lets some of them fuse when they get very close <strong>and</strong> are moving fast relative to each other.</p>
                 <p class="theory">(In reality the nuclei must quantum-tunnel through the Coulomb barrier. The probability rises sharply with temperature because of the high-energy tail of the Maxwell-Boltzmann distribution.)</p>`
      },
      {
        title: "5. Plasma Temperature — the \"150 MK\" you see",
        body: `<p><strong>MK = Megakelvin</strong> = millions of degrees on the absolute (Kelvin) scale.</p>
                 <p>150 MK is the temperature range real fusion devices aim for with D-T fuel. The random \"kicks\" you see in the simulation become stronger as this number increases.</p>
                 <p class="theory">(Temperature here controls the average kinetic energy per particle: ½ mv² ≈ (3/2) kT. At ~150 million K a small fraction of particles have enough energy to have a chance of fusing.)</p>`
      },
      {
        title: "6. The four numbers on the panel",
        body: `<p><strong>Particles</strong> — how many ions are currently inside our virtual reactor chamber.</p>
                 <p><strong>Fusions</strong> — total successful D-T reactions since you pressed Reset.</p>
                 <p><strong>Energy (MeV)</strong> — cumulative energy released. Every single fusion adds 17.59 mega-electronvolts.</p>
                 <p><strong>Time scale ×10¹²</strong> — the simulation is deliberately slowed down by one trillion times. Nuclear events that normally happen in picoseconds (10⁻¹² s) are stretched so you can watch them.</p>
                 <p class="theory">(MeV is a convenient energy unit for nuclear physics: 1 MeV = 1.6 × 10⁻¹³ joules. A single D-T fusion releases ~17.6 MeV — about 10 million times more energy per reaction than a typical chemical reaction.)</p>`
      },
      {
        title: "7. The invisible spherical cage (the BOX)",
        body: `<p>Particles that fly too far from the center are gently pushed back. This represents the powerful <strong>magnetic confinement</strong> used in real machines (tokamaks, stellarators).</p>
                 <p>Without it the 150-million-degree plasma would instantly melt any solid wall.</p>
                 <p class="theory">(The magnetic fields create a \"magnetic bottle\". Charged particles spiral along field lines and cannot easily escape perpendicular to the field — this is why we can hold matter at temperatures far hotter than the surface of the Sun.)</p>`
      },
      {
        title: "8. The children of every fusion event",
        body: `<p><strong>Yellow particles = Helium-4 (He)</strong><br>
                 The \"ash\" left after fusion. They are heavier (mass 4) and carry away some of the energy.</p>
                 <p><strong>Small white fast particles = Neutrons (n)</strong><br>
                 Neutrons have no electric charge, so magnetic fields cannot hold them. They fly out in a straight line at high speed. In the simulation they disappear after a while (they have left the chamber).</p>
                 <p class="theory">(In a real power plant the neutrons carry 80 % of the fusion energy. They are absorbed in a \"blanket\" that becomes hot and drives steam turbines. The helium stays in the plasma and must eventually be removed.)</p>`
      },
      {
        title: "9. The yellow spark bursts",
        body: `<p>Every time a fusion occurs you see a small explosion of yellow sparks. These visualize the sudden release of kinetic energy and the birth of the energetic neutron.</p>
                 <p class="theory">(The sparks are purely visual — they represent the ~3.5 MeV given to the helium and the 14.1 MeV carried by the neutron in the real reaction.)</p>`
      },
      {
        title: "10. How to explore the reactor",
        body: `<p><strong>Drag with your mouse or finger</strong> across the screen to rotate the entire cloud of particles. This lets you look at the plasma from any angle, just like walking around a real experiment.</p>
                 <p>The simulation is fully 3D even though it is drawn on a 2D screen using a simple but effective depth-projection technique.</p>`
      },
      {
        title: "Why this simulation exists",
        body: `<p>Real fusion happens in billionths of a second. By stretching time a trillion times and showing only 148 particles, you can <strong>see</strong> the physics that will one day power cities with sea water and lithium.</p>
                 <p class="theory">(D-T fusion is the front-runner for the first generation of fusion power plants. The ultimate fuel dream is aneutronic fusion (p + ¹¹B), but that requires much higher temperatures. D-T is our stepping stone.)</p>
                 <p style="margin-top:16px; font-style:italic; color:#0f8;">You now understand every color, every number, and every physical idea shown in this simulation. Welcome to the world of fusion!</p>`
      }
    ]
  },

  tr: {
    title: "Füzyon Simülasyonunu Anlamak",
    subtitle: "\"Hiçbir şey bilmiyorum\"dan \"Her sayının ve rengin ne anlama geldiğini anlıyorum\"a nazik bir yolculuk",
    sections: [
      {
        title: "1. Aslında neye bakıyoruz?",
        body: `<p>Şu anda <strong>sanal bir füzyon reaktörünün</strong> içindesiniz. Çok küçük, elektrik yüklü parçacıklar (atom çekirdekleri) aşırı hızlarda uçuyor. Doğru türden iki tanesi yeterince yaklaşıp yeterince hızlı hareket ederse <strong>birleşiyor</strong> ve enerji açığa çıkarıyor.</p>
                 <p class="theory">(Teorik: Bu, gelecekteki elektrik santrallerinin kullanmayı umduğu en kolay füzyon tepkimesi olan döteryum-trityum (D-T) nükleer füzyonunun basitleştirilmiş klasik + olasılıksal bir modelidir.)</p>`
      },
      {
        title: "2. İki çeşit yakıt (renkli parçacıklar)",
        body: `<p><strong>Camgöbeği (açık mavi) parçacıklar = Döteryum (D)</strong><br>
                 Hidrojenin \"ağır\" versiyonu: çekirdeğinde 1 proton + 1 nötron bulunur.</p>
                 <p><strong>Yeşil parçacıklar = Trityum (T)</strong><br>
                 Daha da ağır versiyon: 1 proton + 2 nötron.</p>
                 <p class="theory">(Bunlar hidrojenin izotoplarıdır. Hafif oldukları için aralarındaki elektrik itme kuvveti daha ağır atomlara göre daha zayıftır; bu yüzden füzyon daha kolay gerçekleşebilir.)</p>`
      },
      {
        title: "3. Gerçekleşen füzyon tepkimesi",
        body: `<p>Döteryum ile Trityum yeterince sert çarpışınca şu oluşur:</p>
                 <p style="text-align:center; font-size:15px; margin:10px 0;">
                   <strong>D + T  →  Helyum-4 + nötron + 17.59 MeV</strong>
                 </p>
                 <p>Bir helyum çekirdeği (\"kül\"), bir hızlı nötron ve bir enerji patlaması.</p>
                 <p class="theory">(17.59 MeV, kütlenin çok küçük bir kısmının enerjiye dönüşmesinden kaynaklanır — tam olarak Einstein’ın E=mc² denkleminin öngördüğü şeydir. Bu, D-T tepkimesinin meşhur Q-değeridir.)</p>`
      },
      {
        title: "4. Füzyon neden bu kadar zor? — Coulomb Bariyeri",
        body: `<p>Bütün atom çekirdekleri artı yüklüdür, bu yüzden birbirlerini şiddetle <strong>iterler</strong>. Simülasyonda parçacıkların birbirine değmeden geri sektiğini net görebilirsiniz.</p>
                 <p>Simülasyon yine de bazılarının çok yaklaştığında <strong>ve</strong> birbirlerine göre çok hızlı hareket ettiklerinde füzyon yapmasına izin verir.</p>
                 <p class="theory">(Gerçekte çekirdeklerin Coulomb bariyerini kuantum tünelleme ile aşması gerekir. Bu olasılık sıcaklıkla birlikte artar çünkü Maxwell-Boltzmann dağılımının yüksek enerjili kuyruğu sayesinde bazı parçacıklar yeterince hızlı olur.)</p>`
      },
      {
        title: "5. Plazma Sıcaklığı — gördüğünüz \"150 MK\"",
        body: `<p><strong>MK = Megakelvin</strong> = mutlak sıcaklık (Kelvin) ölçeğinde milyonlarca derece demektir.</p>
                 <p>150 MK, gerçek füzyon cihazlarının D-T yakıtı için hedeflediği sıcaklık aralığıdır. Simülasyondaki rastgele \"tekme\" hareketleri bu sayı arttıkça şiddetlenir.</p>
                 <p class="theory">(Buradaki sıcaklık, parçacık başına ortalama kinetik enerjiyi kontrol eder: ½ mv² ≈ (3/2) kT. Yaklaşık 150 milyon K’da parçacıkların küçük bir kısmı füzyon şansı yakalayacak kadar enerjiye sahip olur.)</p>`
      },
      {
        title: "6. Paneldeki dört sayı ne anlama geliyor?",
        body: `<p><strong>Particles (Parçacık)</strong> — sanal reaktör odamızın içinde şu anda bulunan iyon sayısı.</p>
                 <p><strong>Fusions (Füzyon)</strong> — Reset tuşuna bastığınızdan beri gerçekleşen başarılı D-T tepkimelerinin toplamı.</p>
                 <p><strong>Energy (Enerji) — MeV</strong> — birikmiş açığa çıkan enerji. Her başarılı füzyon 17.59 mega-elektronvolt enerji katar.</p>
                 <p><strong>Time scale ×10¹²</strong> — simülasyon kasıtlı olarak trilyon kat yavaşlatılmıştır. Normalde pikosaniye (10⁻¹² s) içinde olan nükleer olaylar, gözlerinizin ve beyninizin takip edebilmesi için uzatılmıştır.</p>
                 <p class="theory">(MeV, nükleer fizikte çok kullanışlı bir enerji birimidir: 1 MeV = 1.6 × 10⁻¹³ joule. Tek bir D-T füzyonu, tipik bir kimyasal tepkimeden yaklaşık 10 milyon kat daha fazla enerji açığa çıkarır.)</p>`
      },
      {
        title: "7. Görünmez küresel kafes (the BOX)",
        body: `<p>Merkezden çok uzaklaşmaya çalışan parçacıklar nazikçe geriye itilir. Bu, gerçek makinelerde (tokamak, stellarator) kullanılan güçlü <strong>manyetik hapsetmeyi</strong> temsil eder.</p>
                 <p>Bu olmasaydı 150 milyon derecelik plazma herhangi bir katı duvarı anında eritirdi.</p>
                 <p class="theory">(Manyetik alanlar bir \"manyetik şişe\" oluşturur. Yüklü parçacıklar alan çizgileri boyunca spiraller çizerek hareket eder ve alana dik yönde kolayca kaçamaz — bu yüzden Güneş yüzeyinden çok daha sıcak maddeleri tutabiliriz.)</p>`
      },
      {
        title: "8. Her füzyonun çocukları",
        body: `<p><strong>Sarı büyük parçacıklar = Helyum-4 (He)</strong><br>
                 Füzyon sonrası kalan \"kül\". Daha ağırdır (kütle 4) ve enerjinin bir kısmını taşır.</p>
                 <p><strong>Küçük beyaz hızlı parçacıklar = Nötronlar (n)</strong><br>
                 Nötronların elektrik yükü yoktur, bu yüzden manyetik alanlar onları tutamaz. Yüksek hızla düz bir çizgi halinde uçarlar. Simülasyonda bir süre sonra kaybolurlar (reaktör odasından çıktıklarını temsil eder).</p>
                 <p class="theory">(Gerçek bir enerji santralinde nötronlar füzyon enerjisinin %80’ini taşır. Bir \"örtü\" (blanket) tarafından emilirler, bu örtü ısınır ve buhar türbinlerini çalıştırır. Helyum plazmada kalır ve zamanla temizlenmesi gerekir.)</p>`
      },
      {
        title: "9. Sarı kıvılcım patlamaları",
        body: `<p>Her füzyon gerçekleştiğinde sarı kıvılcımlardan oluşan küçük bir patlama görürsünüz. Bunlar ani kinetik enerji salınımını ve enerjik nötronun doğuşunu görselleştirir.</p>
                 <p class="theory">(Kıvılcımlar tamamen görseldir — gerçek tepkimede helyuma verilen ~3.5 MeV ve nötronun taşıdığı 14.1 MeV enerjiyi temsil ederler.)</p>`
      },
      {
        title: "10. Reaktörü keşfetmek",
        body: `<p><strong>Farenizle veya parmağınızla</strong> ekran üzerinde sürükleyerek tüm parçacık bulutunu döndürebilirsiniz. Böylece plazmaya herhangi bir açıdan bakabilirsiniz — gerçek bir deneyin etrafında dolaşmak gibi.</p>
                 <p>Simülasyon tamamen üç boyutludur; basit ama etkili bir derinlik projeksiyonu tekniğiyle 2D ekrana çizilir.</p>`
      },
      {
        title: "Bu simülasyon neden var?",
        body: `<p>Gerçek füzyon olayları saniyenin milyarda biri içinde gerçekleşir. Zamanı trilyon kat yavaşlatarak ve sadece 148 parçacık göstererek, bir gün şehirleri deniz suyu ve lityum ile besleyecek fiziği <strong>görebilmeniz</strong> sağlanıyor.</p>
                 <p class="theory">(D-T füzyonu, ilk nesil füzyon santralleri için en önde gelen adaydır. Nihai yakıt hayali nötronsuz füzyondur (p + ¹¹B), ancak bunun için çok daha yüksek sıcaklıklar gerekir. D-T bizim ilk basamağımızdır.)</p>
                 <p style="margin-top:16px; font-style:italic; color:#0f8;">Artık bu simülasyonda gördüğünüz her rengin, her sayının ve her fiziksel kavramın ne anlama geldiğini biliyorsunuz. Füzyon dünyasına hoş geldiniz!</p>`
      }
    ]
  }
};

// Current language state (persists while the page is open)
let currentLang = 'en';

// Render the entire content for a given language
function renderEducationContent(lang) {
  currentLang = lang;

  const data = educationContent[lang];
  const container = document.getElementById('edu-content');
  if (!container) return;

  let html = `<h2>${data.title}</h2>`;
  if (data.subtitle) {
    html += `<p class="edu-subtitle">${data.subtitle}</p>`;
  }

  data.sections.forEach(section => {
    html += `
      <div class="edu-section">
        <h3>${section.title}</h3>
        <div class="edu-body">${section.body}</div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Update language button active states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Also update the Learn button text in the panel if we want bilingual button
  const learnBtn = document.getElementById('learn-btn');
  if (learnBtn) {
    learnBtn.textContent = lang === 'en' ? 'Learn' : 'Ogren';
  }
}

// Open the modal and render in current (or saved) language
function openEducationModal() {
  const modal = document.getElementById('education-modal');
  if (!modal) return;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  // Render in last chosen language (or default 'en')
  renderEducationContent(currentLang);
}

// Close the modal
function closeEducationModal() {
  const modal = document.getElementById('education-modal');
  if (!modal) return;

  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

// Initialize everything: create listeners for language buttons + open/close
export function initEducation() {
  // The button in the control panel
  const learnBtn = document.getElementById('learn-btn');
  if (learnBtn) {
    learnBtn.addEventListener('click', openEducationModal);
  }

  // Modal elements
  const modal = document.getElementById('education-modal');
  if (!modal) return;

  // Close when clicking the dark overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEducationModal();
  });

  // Close button inside modal
  const closeBtn = modal.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeEducationModal);
  }

  // Language switcher buttons (they exist in the HTML)
  const langButtons = modal.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.dataset.lang;
      if (newLang && newLang !== currentLang) {
        renderEducationContent(newLang);
      }
    });
  });

  // Keyboard support: ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeEducationModal();
    }
  });

  // Optional: remember language preference across page reloads
  try {
    const saved = localStorage.getItem('plasmasim_lang');
    if (saved === 'en' || saved === 'tr') {
      currentLang = saved;
    }
  } catch (_) { /* localStorage may be blocked */ }

  // Expose for debugging
  window.PlasmaEducation = { open: openEducationModal, close: closeEducationModal, setLang: renderEducationContent };
}