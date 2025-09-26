import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ExampleCombobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SoalTeks } from "@/components/SoalTeks"
import { SoalSingleChoice } from "@/components/SoalSingleChoice"
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
  const [singleChoice, setSingleChoice] = React.useState("")
  const opsiJawaban = [
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" }
  ]

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
            value={teks}
            onChange={setTeks}
            required
          />
          <br />
          <SoalSingleChoice
            label="Jenis Kelamin"
            opsiJawaban={opsiJawaban}
            value={singleChoice}
            onChange={setSingleChoice}
            required
            layout="vertical"
          />
        </section>
      </div>
    </div>
  )
}

export default ComponentsDemo