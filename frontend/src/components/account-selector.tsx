"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { accounts } from "~/lib/mock-data"

export function AccountSelector({ onSelectAccount }: { onSelectAccount: (accountId: number) => void }) {
    const [open, setOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(accounts[0])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {selectedAccount ? selectedAccount.name : "Select account..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search accounts..." />
                    <CommandList>
                        <CommandEmpty>No account found.</CommandEmpty>
                        <CommandGroup>
                            {accounts.map((account) => (
                                <CommandItem
                                    key={account.id}
                                    onSelect={() => {
                                        setSelectedAccount(account)
                                        onSelectAccount(account.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn("mr-2 h-4 w-4", selectedAccount?.id === account.id ? "opacity-100" : "opacity-0")}
                                    />
                                    {account.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

