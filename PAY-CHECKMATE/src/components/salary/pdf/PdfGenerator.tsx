import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency } from '@/lib/format';
import { calculateDailyTotals } from '@/utils/hours';
import { DAYS } from '@/constants/days';
import { Hours, Allowances, SalaryResult, JobInfo } from '@/types/salary';
import { rates } from '@/constants/rates';

export const generatePDF = async (elementId: string, jobInfo: JobInfo) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  await new Promise(resolve => setTimeout(resolve, 1000));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: document.documentElement.scrollWidth,
    width: document.documentElement.scrollWidth,
    height: element.scrollHeight,
    onclone: (document, element) => {
      const el = element as HTMLElement;
      el.style.width = '100vw';
      el.style.maxWidth = 'none';
      el.style.position = 'relative';
      el.style.display = 'block';
      el.style.backgroundColor = '#ffffff';
      
      // Remove any buttons and background colors
      const buttons = el.querySelectorAll('button, [data-pdf-button]');
      buttons.forEach(button => button.remove());
      
      const elements = el.querySelectorAll('*');
      elements.forEach(element => {
        (element as HTMLElement).style.backgroundColor = 'transparent';
        if ((element as HTMLElement).style.background) {
          (element as HTMLElement).style.background = 'none';
        }
      });
    }
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;
  let page = 1;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = -pageHeight * page;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    page++;
  }

  pdf.save(`releve-paie-${jobInfo.weekEnding}.pdf`);
};

export const PdfGenerator = ({ jobInfo, employeeName, hours, allowances, expenses, salary }: {
  jobInfo: JobInfo;
  employeeName: string;
  hours: Hours;
  allowances: Allowances;
  expenses: any[];
  salary: SalaryResult;
}) => {
  const dailyTotals = calculateDailyTotals(hours);
  const totalDoubleTimeHours = Object.values(hours.doubleTime).reduce((acc, curr) => acc + curr, 0);
  const totalRegularHours = Object.values(hours.regular).reduce((acc, curr) => acc + curr, 0);
  const totalTravelHours = Object.values(hours.travelTime).reduce((acc, curr) => acc + curr, 0);

  return (
    <div id="pdf-content" className="max-w-[800px] mx-auto p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">Relevé de paie</h1>
          <p>Semaine se terminant le {jobInfo.weekEnding || "Non spécifié"}</p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Information du projet</h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Semaine se terminant le</span>
              <span>{jobInfo.weekEnding || "Non spécifié"}</span>
            </div>
            <div className="flex justify-between">
              <span>Compagnie</span>
              <span>{jobInfo.companyName || "Non spécifié"}</span>
            </div>
            <div className="flex justify-between">
              <span>Numéro du projet</span>
              <span>{jobInfo.jobNumber || "Non spécifié"}</span>
            </div>
            <div className="flex justify-between">
              <span>Chantier</span>
              <span>{jobInfo.jobSiteAddress || "Non spécifié"}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Calculs principaux</h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Salaire de base ({totalRegularHours}h @ {rates.regular}$)</span>
              <span>{formatCurrency(salary.baseSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span>Temps double ({totalDoubleTimeHours}h @ {rates.doubleTime}$)</span>
              <span>{formatCurrency(totalDoubleTimeHours * rates.doubleTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Temps de voyage ({totalTravelHours}h @ {rates.travelTime}$)</span>
              <span>{formatCurrency(salary.travelTimePay)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total des primes</span>
              <span>{formatCurrency(salary.premiumTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Équipement de sécurité ({totalRegularHours}h @ 0.60$)</span>
              <span>{formatCurrency(totalRegularHours * 0.60)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Sous-total avant vacances</span>
              <span>{formatCurrency(salary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vacances CCQ (13%)</span>
              <span>{formatCurrency(salary.vacationPay)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Salaire brut</span>
              <span>{formatCurrency(salary.subtotal + salary.vacationPay)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2 text-red-600">Déductions</h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>RRQ/RPC (5.95%)</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.rrq)}</span>
            </div>
            <div className="flex justify-between">
              <span>Assurance emploi (1.63%)</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.ei)}</span>
            </div>
            <div className="flex justify-between">
              <span>RQAP (0.494%)</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.rqap)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impôt provincial</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.provincialTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impôt fédéral</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.federalTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Avantages sociaux CCQ (4.21%)</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.socialBenefits)}</span>
            </div>
            <div className="flex justify-between">
              <span>Prélèvement CCQ (0.44%)</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.ccqLevy)}</span>
            </div>
            <div className="flex justify-between">
              <span>Contribution sectorielle CCQ</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.sectoralContribution)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cotisation syndicale</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.unionDues)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vacances CCQ (13%)</span>
              <span className="text-red-600">{formatCurrency(salary.deductions.vacationPayDeduction)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total des déductions</span>
              <span className="text-red-600">-{formatCurrency(salary.deductions.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between font-bold">
            <span>Salaire brut</span>
            <span>{formatCurrency(salary.subtotal + salary.vacationPay)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total des dépenses</span>
            <span>{formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</span>
          </div>
          <div className="flex justify-between">
            <span>Salaire net</span>
            <span>{formatCurrency(salary.netPay)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Dépôt total</span>
            <span>{formatCurrency(salary.totalPayment)}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <img 
            src="/signature.PNG" 
            alt="Signature" 
            className="h-12 mx-auto mb-2"
          />
          <p className="text-sm">Fait avec Victaure.com</p>
        </div>
      </div>
    </div>
  );
};