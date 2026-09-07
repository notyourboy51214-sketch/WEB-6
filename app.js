/**
 * HELIOS Microgrid Systems — 25-Year Solar ROI & Microgrid Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const billSlider = document.getElementById('billSlider');
  const billDisplay = document.getElementById('billDisplay');
  const zoneButtons = document.querySelectorAll('#zoneSelector .zone-btn');
  const batteryButtons = document.querySelectorAll('#batteryPills .b-btn');
  const batteryDisplay = document.getElementById('batteryDisplay');

  // Outputs
  const netSavings = document.getElementById('netSavings');
  const arrayKw = document.getElementById('arrayKw');
  const federalTaxCredit = document.getElementById('federalTaxCredit');
  const independenceScore = document.getElementById('independenceScore');
  const co2Offset = document.getElementById('co2Offset');

  // State
  let peakSunHours = 5.2;
  let batteryUnits = 2;

  function calculateSolarYield() {
    const monthlyBill = parseFloat(billSlider.value);
    const avgKwhRate = 0.23; // $0.23/kWh
    const monthlyKwh = monthlyBill / avgKwhRate;
    const dailyKwh = monthlyKwh / 30;

    // Required Array size = dailyKwh / (peakSunHours * 0.82 system derate factor)
    const requiredKw = (dailyKwh / (peakSunHours * 0.82)).toFixed(1);

    // System gross cost estimate: ~$2.65 per Watt installed
    const grossSolarCost = parseFloat(requiredKw) * 1000 * 2.65;
    const storageCost = batteryUnits * 6500; // $6,500 per 14kWh solid-state battery unit
    const grossTotalCost = grossSolarCost + storageCost;

    // Federal Clean Energy 30% Investment Tax Credit (ITC)
    const itcAmount = Math.round(grossTotalCost * 0.30);
    const netSystemInvestment = grossTotalCost - itcAmount;

    // 25-Year utility cost without solar (escalating 4.8% annually)
    let cumulativeUtilityCost = 0;
    let currentAnnualBill = monthlyBill * 12;
    for (let i = 0; i < 25; i++) {
      cumulativeUtilityCost += currentAnnualBill;
      currentAnnualBill *= 1.048;
    }

    // Solar generation offsets ~95% of utility consumption, plus battery storage self-consumption
    let offsetFraction = 0.90;
    if (batteryUnits === 1) offsetFraction = 0.94;
    if (batteryUnits === 2) offsetFraction = 0.98;
    if (batteryUnits >= 3) offsetFraction = 1.00;

    const totalSavedOver25Years = Math.round((cumulativeUtilityCost * offsetFraction) - netSystemInvestment);

    // Grid independence percentage
    let independence = Math.min(100, Math.round(offsetFraction * 100));

    // CO2 offset in metric tons (approx 0.85 lbs CO2 per kWh solar generated over 25 years)
    const annualKwhGenerated = parseFloat(requiredKw) * peakSunHours * 365 * 0.82;
    const lifetimeMetricTonsCO2 = Math.round((annualKwhGenerated * 25 * 0.85) / 2204.62);

    // Update UI
    billDisplay.textContent = `$${monthlyBill.toLocaleString()} / month`;
    batteryDisplay.textContent = `${batteryUnits} Units (${batteryUnits * 14} kWh Capacity)`;

    netSavings.textContent = totalSavedOver25Years.toLocaleString();
    arrayKw.textContent = `${requiredKw} kW DC`;
    federalTaxCredit.textContent = `$${itcAmount.toLocaleString()}`;
    independenceScore.textContent = `${independence}% Autonomous`;
    co2Offset.textContent = `${lifetimeMetricTonsCO2.toLocaleString()} Metric Tons CO₂`;
  }

  billSlider.addEventListener('input', calculateSolarYield);

  zoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      zoneButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      peakSunHours = parseFloat(btn.dataset.sun);
      calculateSolarYield();
    });
  });

  batteryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      batteryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      batteryUnits = parseInt(btn.dataset.units, 10);
      calculateSolarYield();
    });
  });

  // Modal Handling
  const auditModal = document.getElementById('auditModal');
  const navAuditBtn = document.getElementById('navAuditBtn');
  const drawerAuditBtn = document.getElementById('drawerAuditBtn');
  const lockYieldBtn = document.getElementById('lockYieldBtn');
  const closeAuditBtn = document.getElementById('closeAuditBtn');
  const auditForm = document.getElementById('auditForm');
  const auditSuccess = document.getElementById('auditSuccess');

  const openModal = () => {
    auditModal.classList.add('active');
    auditModal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    auditModal.classList.remove('active');
    auditModal.setAttribute('aria-hidden', 'true');
  };

  if (navAuditBtn) navAuditBtn.addEventListener('click', openModal);
  if (drawerAuditBtn) drawerAuditBtn.addEventListener('click', openModal);
  if (lockYieldBtn) lockYieldBtn.addEventListener('click', openModal);
  if (closeAuditBtn) closeAuditBtn.addEventListener('click', closeModal);

  auditModal.addEventListener('click', (e) => {
    if (e.target === auditModal) closeModal();
  });

  auditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    auditSuccess.style.display = 'block';
    setTimeout(() => {
      auditSuccess.style.display = 'none';
      closeModal();
      auditForm.reset();
    }, 3200);
  });

  // Mobile Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  mobileMenuBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  calculateSolarYield();
});
