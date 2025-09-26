import { SoalComboBox } from "@/components/SoalComboBox"
import { SoalMultiChoice } from "@/components/SoalMultiChoice"
import { SoalRating } from "@/components/SoalRating"
import { SoalSingleChoice } from "@/components/SoalSingleChoice"
import { SoalTeks } from "@/components/SoalTeks"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ExampleCombobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import * as React from "react"

export function ComponentsDemo() {
  const [progress, setProgress] = React.useState(13)
  const [checkedItems, setCheckedItems] = React.useState({
    item1: false,
    item2: false,
    item3: false,
  })
  const [inputValue, setInputValue] = React.useState("")
  const [radioValue, setRadioValue] = React.useState("option1")
  const [teks, setTeks] = React.useState("")
  const [number, setNumber] = React.useState("")
  const [singleChoice, setSingleChoice] = React.useState("")
  const [otherValue, setOtherValue] = React.useState("")
  const [showValidation, setShowValidation] = React.useState(false)
  const opsiJawaban = React.useMemo(() => [
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" },
    { value: "other", label: "Lainnya", isOther: true }
  ], [])
  const [multiChoice, setMultiChoice] = React.useState<string[]>([])
  const [otherMultiValue, setOtherMultiValue] = React.useState("")
  const [comboBoxValues, setComboBoxValues] = React.useState<Record<string, string>>({})
  const [ratingValues, setRatingValues] = React.useState<Record<string, string>>({})

  // Handler untuk tombol Next - dioptimasi dengan useCallback
  const handleNext = React.useCallback(() => {
    setShowValidation(true)
    
    // Simulasi validasi
    const errors = []
    
    if (!teks.trim()) {
      errors.push("Nama lengkap harus diisi")
    }
    
    if (!number.trim()) {
      errors.push("Umur harus diisi")
    }
    
    if (!singleChoice) {
      errors.push("Jenis kelamin harus dipilih")
    }
    
    if (singleChoice === "other" && !otherValue.trim()) {
      errors.push("Jenis kelamin lainnya harus diisi")
    }
    
    if (multiChoice.length === 0) {
      errors.push("Minimal pilih satu olahraga")
    }
    
    if (multiChoice.includes("other") && !otherMultiValue.trim()) {
      errors.push("Olahraga lainnya harus diisi")
    }
    
    if (!comboBoxValues.provinsi) {
      errors.push("Provinsi harus dipilih")
    }
    
    if (!comboBoxValues.kabupaten) {
      errors.push("Kabupaten/Kota harus dipilih")
    }
    
    // Validasi rating - minimal 3 item harus diisi
    const filledRatings = Object.values(ratingValues).filter(value => value).length
    if (filledRatings < 3) {
      errors.push("Minimal 3 fasilitas harus dinilai")
    }
    
    if (errors.length > 0) {
      alert("Validasi gagal:\n" + errors.join("\n"))
    } else {
      alert("Form valid! Data berhasil disimpan.")
      setShowValidation(false)
    }
  }, [teks, number, singleChoice, otherValue, multiChoice, otherMultiValue, comboBoxValues, ratingValues])
  const opsiJawabanMulti = React.useMemo(() => [
    { value: "Basket", label: "Basket"},
    { value: "Bola", label: "Bola"},
    { value: "Tenis", label: "Tenis"},
    { value: "other", label: "Lainnya", isOther: true},
  ], [])

  // Data untuk ComboBox - dioptimasi dengan useMemo
  const opsiProvinsi = React.useMemo(() => [
    { value: "dki-jakarta", label: "DKI Jakarta" },
    { value: "jawa-barat", label: "Jawa Barat" },
    { value: "jawa-tengah", label: "Jawa Tengah" },
    { value: "jawa-timur", label: "Jawa Timur" },
    { value: "banten", label: "Banten" },
    { value: "bali", label: "Bali" },
    { value: "sumatera-utara", label: "Sumatera Utara" },
    { value: "sumatera-selatan", label: "Sumatera Selatan" },
    { value: "kepulauan-bangka-belitung", label: "Kepulauan Bangka Belitung" },
    { value: "kalimantan-timur", label: "Kalimantan Timur" },
    { value: "sulawesi-selatan", label: "Sulawesi Selatan" },
    { value: "papua", label: "Papua" }
  ], [])

  const opsiKabupaten = React.useMemo(() => [
    { value: "jakarta-pusat", label: "Jakarta Pusat" },
    { value: "jakarta-selatan", label: "Jakarta Selatan" },
    { value: "jakarta-utara", label: "Jakarta Utara" },
    { value: "jakarta-barat", label: "Jakarta Barat" },
    { value: "jakarta-timur", label: "Jakarta Timur" },
    { value: "kabupaten-tangerang", label: "Kabupaten Tangerang" },
    { value: "kota-tangerang", label: "Kota Tangerang" },
    { value: "kabupaten-bekasi", label: "Kabupaten Bekasi" },
    { value: "kota-bekasi", label: "Kota Bekasi" },
    { value: "kabupaten-belitung", label: "Kabupaten Belitung" },
    { value: "kota-pangkal-pinang", label: "Kota Pangkal Pinang" },
    { value: "kabupaten-bangka", label: "Kabupaten Bangka" }
  ], [])

  const comboboxItems = React.useMemo(() => [
    {
      id: "provinsi",
      label: "Provinsi",
      placeholder: "Pilih provinsi...",
      searchPlaceholder: "Cari provinsi...",
      required: true,
      opsiComboBox: opsiProvinsi
    },
    {
      id: "kabupaten",
      label: "Kab/Kota",
      placeholder: "Pilih kabupaten/kota...",
      searchPlaceholder: "Cari kabupaten/kota...",
      required: true,
      opsiComboBox: opsiKabupaten
    }
  ], [opsiProvinsi, opsiKabupaten])

  // Data untuk Rating - dioptimasi dengan useMemo
  const ratingItems = React.useMemo(() => [
    { id: "perpustakaan", label: "Perpustakaan" },
    { id: "tik", label: "Teknologi Informasi dan Komunikasi" },
    { id: "modul-belajar", label: "Modul belajar" },
    { id: "ruang-belajar", label: "Ruang belajar" },
    { id: "laboratorium", label: "Laboratorium" },
    { id: "variasi-matakuliah", label: "Variasi matakuliah yang ditawarkan" },
    { id: "akomodasi-transportasi", label: "Akomodasi dan transportasi" },
    { id: "kantin", label: "Kantin" },
    { id: "pusat-kegiatan", label: "Pusat kegiatan mahasiswa dan fasilitasnya, ruang rekreasi" },
    { id: "layanan-kesehatan", label: "Fasilitas layanan kesehatan" }
  ], [])

  // Rating options yang bisa dikustomisasi - dioptimasi dengan useMemo
  const customRatingOptions = React.useMemo(() => [
    { value: "sangat-buruk", label: "Sangat Buruk" },
    { value: "buruk", label: "Buruk" },
    { value: "cukup", label: "Cukup" },
    { value: "baik", label: "Baik" },
    { value: "sangat-baik", label: "Sangat Baik" }
  ], [])

  // Contoh rating options alternatif (untuk referensi)
  // const alternativeRatingOptions = [
  //   { value: "tidak-setuju", label: "Tidak Setuju" },
  //   { value: "kurang-setuju", label: "Kurang Setuju" },
  //   { value: "netral", label: "Netral" },
  //   { value: "setuju", label: "Setuju" },
  //   { value: "sangat-setuju", label: "Sangat Setuju" }
  // ]

  // Handler untuk reset validation - dioptimasi dengan useCallback
  const handleResetValidation = React.useCallback(() => {
    setShowValidation(false)
  }, [])

  // Handler untuk combo box change - dioptimasi dengan useCallback
  const handleComboBoxChange = React.useCallback((id: string, value: string) => {
    setComboBoxValues(prev => ({ ...prev, [id]: value }))
  }, [])

  // Handler untuk rating change - dioptimasi dengan useCallback
  const handleRatingChange = React.useCallback((itemId: string, value: string) => {
    setRatingValues(prev => ({ ...prev, [itemId]: value }))
  }, [])

  // Progress demo - simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">UI Components Demo</h1>
      
      <div className="space-y-12">
        {/* Button Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">1. Button Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">States</h3>
              <div className="flex flex-wrap gap-2">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">2. Input Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Text Input</Label>
              <Input
                id="text-input"
                type="text"
                placeholder="Enter text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <p className="text-sm text-gray-600">You typed: {inputValue}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-input">Email Input</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="Enter email..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password-input">Password Input</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="Enter password..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="disabled-input">Disabled Input</Label>
              <Input
                id="disabled-input"
                type="text"
                placeholder="This is disabled"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-input">Textarea Input</Label>
              <Input
                id="underline-input-input"
                variant="underline"
                placeholder="Enter text..."
              />
            </div>
          </div>
        </section>

        {/* Checkbox Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">3. Checkbox Component</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox1"
                checked={checkedItems.item1}
                onCheckedChange={(checked) =>
                  setCheckedItems(prev => ({ ...prev, item1: !!checked }))
                }
              />
              <Label htmlFor="checkbox1">Accept terms and conditions</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox2"
                checked={checkedItems.item2}
                onCheckedChange={(checked) =>
                  setCheckedItems(prev => ({ ...prev, item2: !!checked }))
                }
              />
              <Label htmlFor="checkbox2">Subscribe to newsletter</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox3"
                checked={checkedItems.item3}
                onCheckedChange={(checked) =>
                  setCheckedItems(prev => ({ ...prev, item3: !!checked }))
                }
              />
              <Label htmlFor="checkbox3">Enable notifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox-disabled" disabled />
              <Label htmlFor="checkbox-disabled">Disabled checkbox</Label>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm">
              Selected items: {Object.entries(checkedItems)
                .filter(([, checked]) => checked)
                .map(([key]) => key)
                .join(", ") || "None"}
            </p>
          </div>
        </section>

        {/* Combobox Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">4. Combobox Component</h2>
          <div className="space-y-2">
            <Label>Select a framework</Label>
            <ExampleCombobox />
            <p className="text-sm text-gray-600">
              A searchable dropdown with multiple options. Click to open and type to search.
            </p>
          </div>
        </section>

        {/* Progress Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">5. Progress Component</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loading Progress: {progress}%</Label>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <Label>Different Progress Values</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="w-16 text-sm">25%</span>
                  <Progress value={25} className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="w-16 text-sm">50%</span>
                  <Progress value={50} className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="w-16 text-sm">75%</span>
                  <Progress value={75} className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="w-16 text-sm">100%</span>
                  <Progress value={100} className="flex-1" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setProgress(Math.max(0, progress - 10))}>
                Decrease (-10%)
              </Button>
              <Button onClick={() => setProgress(Math.min(100, progress + 10))}>
                Increase (+10%)
              </Button>
              <Button onClick={() => setProgress(0)} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </section>

        {/* Radio Group Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">6. Radio Group Component</h2>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Choose your preferred option</Label>
              <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">Option 1 - Basic Plan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">Option 2 - Premium Plan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">Option 3 - Enterprise Plan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option4" id="option4" disabled />
                  <Label htmlFor="option4">Option 4 - Disabled</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm">Selected: {radioValue}</p>
            </div>
          </div>
        </section>

        {/* Combined Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Combined Form Example</h2>
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium">User Preferences Form</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter username" />
              </div>
              
              <div className="space-y-2">
                <Label>Framework Preference</Label>
                <ExampleCombobox />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Subscription Type</Label>
              <RadioGroup defaultValue="basic">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic">Basic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="pro" />
                  <Label htmlFor="pro">Pro</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label>Preferences</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="notifications" />
                <Label htmlFor="notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" />
                <Label htmlFor="marketing">Marketing emails</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Profile Completion</Label>
              <Progress value={80} />
              <p className="text-sm text-gray-600">80% complete</p>
            </div>
            
            <div className="flex gap-2">
              <Button>Save Preferences</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </section>
        {/* Soal example */}
        <section>
          <h2>Soal example</h2>
          <SoalTeks 
            label="Nama Lengkap" 
            placeholder="Masukkan nama lengkap anda" 
            variant="text"
            value={teks}
            onChange={setTeks}
            required
          />
          <br />
          <SoalTeks 
            label="Umur" 
            placeholder="Berapa umur anda" 
            variant="number"
            value={number}
            onChange={setNumber}
            required
          />
          <br />
          <SoalSingleChoice
            label="Jenis Kelamin"
            opsiJawaban={opsiJawaban}
            value={singleChoice}
            onChange={setSingleChoice}
            otherValue={otherValue}
            onOtherValueChange={setOtherValue}
            otherInputPlaceholder="Masukkan jenis kelamin lainnya..."
            validateOther={showValidation}
            errorMessage="Harap isi jenis kelamin lainnya"
            required
            layout="vertical"
          />
          <br />
          <SoalMultiChoice
            label="Olahraga apa yang anda sukai"
            opsiJawaban={opsiJawabanMulti}
            value={multiChoice}
            onChange={setMultiChoice}
            otherValue={otherMultiValue}
            onOtherValueChange={setOtherMultiValue}
            otherInputPlaceholder="Masukkan olahraga lainnya..."
            validateOther={showValidation}
            errorMessage="Harap isi olahraga lainnya"
            required
            layout="vertical"
          />
          <br />
          
          {/* SoalComboBox - Multiple Combobox */}
          <SoalComboBox
            label="Pilihlah spesifikasi daerah asal anda?"
            comboboxItems={comboboxItems}
            values={comboBoxValues}
            onChange={handleComboBoxChange}
            layout="horizontal"
            required
          />
          <br />
          
          {/* SoalRating - Rating Table dengan custom options */}
          <SoalRating
            label="Selama anda kuliah di UNAND, bagaimana pendapat anda terhadap kondisi fasilitas belajar di bawah ini?"
            ratingItems={ratingItems}
            ratingOptions={customRatingOptions}
            values={ratingValues}
            onChange={handleRatingChange}
            required
          />
          <br />
          
          {/* Tombol Next untuk simulasi validasi */}
          <div className="flex gap-4 mt-6">
            <Button onClick={handleNext} className="px-8">
              Next
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetValidation}
            >
              Reset Validation
            </Button>
          </div>
          
          {showValidation && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Mode Validasi Aktif:</strong> Error akan muncul jika field tidak diisi dengan benar.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ComponentsDemo