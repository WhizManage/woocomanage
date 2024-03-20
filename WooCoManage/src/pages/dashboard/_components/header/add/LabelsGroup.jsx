import { IconBadge } from '@components/IconBadge'
import { Label } from '@components/ui/label'
import { Tags } from 'lucide-react'
import React from 'react'
import MultiSelectInput from './MultiSelectInput'

const LabelsGroup = ({updateValue}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={Tags} />
        <h2 className="text-xl dark:text-gray-400">Tags & Categories</h2>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="email">Product tags</Label>
        <MultiSelectInput columnName="tags" updateValue={updateValue} />
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="email">Product categories</Label>
        <MultiSelectInput columnName="categories" updateValue={updateValue} />
      </div>
    </div>
  )
}

export default LabelsGroup